import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Webhook secret para validar requests de Resend
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || 'your-webhook-secret';

interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.delivery_delayed' | 'email.complained' | 'email.bounced' | 'email.opened' | 'email.clicked';
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    click?: {
      ipAddress: string;
      link: string;
      timestamp: string;
      userAgent: string;
    };
    open?: {
      ipAddress: string;
      timestamp: string;
      userAgent: string;
    };
    bounce?: {
      bounceType: string;
      timestamp: string;
    };
    complaint?: {
      complaintType: string;
      timestamp: string;
    };
  };
}

// POST endpoint para webhooks de Resend
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('resend-signature');

    // Validar webhook signature (opcional pero recomendado)
    if (signature && WEBHOOK_SECRET !== 'your-webhook-secret') {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    const event: ResendWebhookEvent = JSON.parse(body);
    
    // Buscar el email log correspondiente
    const { data: emailLog, error: logError } = await supabase
      .from('email_logs')
      .select('*')
      .eq('resend_id', event.data.email_id)
      .single();

    if (logError || !emailLog) {
      console.warn('Email log no encontrado para ID:', event.data.email_id);
      return NextResponse.json({ message: 'Email log not found' }, { status: 404 });
    }

    // Mapear tipo de evento
    const eventTypeMap: Record<string, string> = {
      'email.sent': 'sent',
      'email.delivered': 'delivered',
      'email.opened': 'opened',
      'email.clicked': 'clicked',
      'email.bounced': 'bounced',
      'email.complained': 'complained'
    };

    const trackingEventType = eventTypeMap[event.type];
    if (!trackingEventType) {
      console.warn('Tipo de evento no reconocido:', event.type);
      return NextResponse.json({ message: 'Event type not recognized' }, { status: 400 });
    }

    // Preparar datos del evento
    let eventData: any = {
      email_id: event.data.email_id,
      timestamp: event.created_at
    };

    let userAgent: string | null = null;
    let ipAddress: string | null = null;

    // Agregar datos específicos según el tipo de evento
    switch (event.type) {
      case 'email.opened':
        if (event.data.open) {
          userAgent = event.data.open.userAgent;
          ipAddress = event.data.open.ipAddress;
          eventData.open_data = event.data.open;
        }
        break;
      case 'email.clicked':
        if (event.data.click) {
          userAgent = event.data.click.userAgent;
          ipAddress = event.data.click.ipAddress;
          eventData.click_data = {
            link: event.data.click.link,
            timestamp: event.data.click.timestamp
          };
        }
        break;
      case 'email.bounced':
        if (event.data.bounce) {
          eventData.bounce_data = event.data.bounce;
        }
        break;
      case 'email.complained':
        if (event.data.complaint) {
          eventData.complaint_data = event.data.complaint;
        }
        break;
    }

    // Insertar evento de tracking
    const { error: trackingError } = await supabase
      .from('email_tracking')
      .insert({
        email_log_id: emailLog.id,
        event_type: trackingEventType,
        event_data: eventData,
        user_agent: userAgent,
        ip_address: ipAddress,
        timestamp: event.created_at
      });

    if (trackingError) {
      console.error('Error insertando tracking:', trackingError);
      return NextResponse.json(
        { error: 'Error saving tracking data' },
        { status: 500 }
      );
    }

    // Actualizar estado del email log si es necesario
    if (trackingEventType === 'delivered') {
      await supabase
        .from('email_logs')
        .update({ status: 'delivered' })
        .eq('id', emailLog.id);
    } else if (trackingEventType === 'bounced') {
      await supabase
        .from('email_logs')
        .update({ status: 'bounced' })
        .eq('id', emailLog.id);
    }

    // Actualizar métricas de campaña
    await updateCampaignMetrics(emailLog.email_type, trackingEventType);

    return NextResponse.json({ message: 'Event processed successfully' });

  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint para obtener métricas de tracking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const emailType = searchParams.get('email_type');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const campaign = searchParams.get('campaign');

    // Construir query base
    let query = supabase
      .from('email_tracking')
      .select(`
        *,
        email_logs!inner(
          email_type,
          recipient_email,
          sent_at
        )
      `);

    // Aplicar filtros
    if (emailType) {
      query = query.eq('email_logs.email_type', emailType);
    }

    if (startDate) {
      query = query.gte('timestamp', startDate);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate);
    }

    const { data: trackingData, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Error obteniendo datos de tracking' },
        { status: 500 }
      );
    }

    // Calcular métricas agregadas
    const metrics = calculateMetrics(trackingData);

    // Obtener métricas de campaña si se especifica
    let campaignMetrics = null;
    if (campaign) {
      const { data: campaignData } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_name', campaign)
        .order('campaign_date', { ascending: false })
        .limit(1)
        .single();
      
      campaignMetrics = campaignData;
    }

    return NextResponse.json({
      tracking_data: trackingData,
      metrics,
      campaign_metrics: campaignMetrics
    });

  } catch (error) {
    console.error('Error en GET de tracking:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para actualizar métricas de campaña
async function updateCampaignMetrics(emailType: string, eventType: string) {
  try {
    // Obtener la campaña más reciente para este tipo de email
    const { data: latestCampaign } = await supabase
      .from('campaign_metrics')
      .select('*')
      .eq('campaign_date', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!latestCampaign) return;

    // Incrementar contador según el tipo de evento
    const updateField = {
      'delivered': 'total_delivered',
      'opened': 'total_opened',
      'clicked': 'total_clicked',
      'bounced': 'total_bounced'
    }[eventType];

    if (!updateField) return;

    // Actualizar contador
    await supabase.rpc('increment_campaign_metric', {
      campaign_id: latestCampaign.id,
      field_name: updateField
    });

    // Recalcular tasas
    const { data: updatedCampaign } = await supabase
      .from('campaign_metrics')
      .select('*')
      .eq('id', latestCampaign.id)
      .single();

    if (updatedCampaign) {
      const openRate = updatedCampaign.total_sent > 0 
        ? (updatedCampaign.total_opened / updatedCampaign.total_sent * 100).toFixed(2)
        : 0;
      
      const clickRate = updatedCampaign.total_opened > 0
        ? (updatedCampaign.total_clicked / updatedCampaign.total_opened * 100).toFixed(2)
        : 0;
      
      const bounceRate = updatedCampaign.total_sent > 0
        ? (updatedCampaign.total_bounced / updatedCampaign.total_sent * 100).toFixed(2)
        : 0;

      await supabase
        .from('campaign_metrics')
        .update({
          open_rate: parseFloat(openRate),
          click_rate: parseFloat(clickRate),
          bounce_rate: parseFloat(bounceRate)
        })
        .eq('id', latestCampaign.id);
    }

  } catch (error) {
    console.error('Error actualizando métricas de campaña:', error);
  }
}

// Función para calcular métricas agregadas
function calculateMetrics(trackingData: any[]) {
  const totalEmails = new Set(trackingData.map(t => t.email_log_id)).size;
  
  const eventCounts = trackingData.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueOpens = new Set(
    trackingData
      .filter(t => t.event_type === 'opened')
      .map(t => t.email_log_id)
  ).size;

  const uniqueClicks = new Set(
    trackingData
      .filter(t => t.event_type === 'clicked')
      .map(t => t.email_log_id)
  ).size;

  return {
    total_emails: totalEmails,
    total_sent: eventCounts.sent || 0,
    total_delivered: eventCounts.delivered || 0,
    total_opened: eventCounts.opened || 0,
    total_clicked: eventCounts.clicked || 0,
    total_bounced: eventCounts.bounced || 0,
    total_complained: eventCounts.complained || 0,
    unique_opens: uniqueOpens,
    unique_clicks: uniqueClicks,
    open_rate: totalEmails > 0 ? ((uniqueOpens / totalEmails) * 100).toFixed(2) : '0.00',
    click_rate: uniqueOpens > 0 ? ((uniqueClicks / uniqueOpens) * 100).toFixed(2) : '0.00',
    bounce_rate: totalEmails > 0 ? ((eventCounts.bounced || 0) / totalEmails * 100).toFixed(2) : '0.00'
  };
}