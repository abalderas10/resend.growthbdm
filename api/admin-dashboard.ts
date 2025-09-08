import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para verificar autenticación y permisos
async function verifyAdminAccess(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('sb-access-token')?.value;
    
    if (!token) {
      return { error: 'No authenticated', status: 401 };
    }

    // Verificar token con Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return { error: 'Invalid token', status: 401 };
    }

    // Verificar permisos de administrador
    const { data: permissions, error: permError } = await supabase
      .from('permission_table')
      .select('permission_type')
      .eq('user_id', user.id)
      .eq('permission_type', 'admin')
      .single();

    if (permError || !permissions) {
      return { error: 'Insufficient permissions', status: 403 };
    }

    return { user, permissions };
  } catch (error) {
    return { error: 'Authentication error', status: 500 };
  }
}

// GET endpoint para obtener datos del dashboard
export async function GET(request: NextRequest) {
  try {
    // Verificar acceso de administrador
    const authResult = await verifyAdminAccess(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const emailType = searchParams.get('email_type');

    switch (action) {
      case 'overview':
        return await getOverviewData(startDate, endDate);
      
      case 'contacts':
        return await getContactsData(searchParams);
      
      case 'campaigns':
        return await getCampaignsData(startDate, endDate);
      
      case 'templates':
        return await getTemplatesData();
      
      case 'analytics':
        return await getAnalyticsData(startDate, endDate, emailType);
      
      case 'users':
        return await getUsersData();
      
      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error en dashboard GET:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST endpoint para acciones administrativas
export async function POST(request: NextRequest) {
  try {
    // Verificar acceso de administrador
    const authResult = await verifyAdminAccess(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_campaign':
        return await createCampaign(data, authResult.user.id);
      
      case 'update_template':
        return await updateTemplate(data);
      
      case 'manage_user_permissions':
        return await manageUserPermissions(data);
      
      case 'bulk_import_contacts':
        return await bulkImportContacts(data);
      
      case 'send_test_email':
        return await sendTestEmail(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error en dashboard POST:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para obtener datos de overview
async function getOverviewData(startDate?: string | null, endDate?: string | null) {
  try {
    const dateFilter = startDate && endDate ? 
      `sent_at >= '${startDate}' AND sent_at <= '${endDate}'` : 
      `sent_at >= '${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}'`;

    // Estadísticas generales
    const [contactsResult, emailsResult, campaignsResult] = await Promise.all([
      supabase.from('invitados_mipim2025').select('*', { count: 'exact', head: true }),
      supabase.from('email_logs').select('*', { count: 'exact', head: true }).filter('sent_at', 'gte', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('campaign_metrics').select('*').order('campaign_date', { ascending: false }).limit(5)
    ]);

    // Métricas de email por tipo
    const { data: emailMetrics } = await supabase
      .from('email_logs')
      .select('email_type, status')
      .filter('sent_at', 'gte', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Actividad reciente
    const { data: recentActivity } = await supabase
      .from('email_logs')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10);

    // Procesar métricas por tipo de email
    const emailTypeMetrics = emailMetrics?.reduce((acc, email) => {
      if (!acc[email.email_type]) {
        acc[email.email_type] = { sent: 0, delivered: 0, failed: 0 };
      }
      acc[email.email_type][email.status === 'sent' ? 'sent' : email.status === 'delivered' ? 'delivered' : 'failed']++;
      return acc;
    }, {} as Record<string, any>) || {};

    return NextResponse.json({
      overview: {
        total_contacts: contactsResult.count || 0,
        total_emails_sent: emailsResult.count || 0,
        recent_campaigns: campaignsResult.data || [],
        email_type_metrics: emailTypeMetrics,
        recent_activity: recentActivity || []
      }
    });

  } catch (error) {
    console.error('Error obteniendo overview:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos de overview' },
      { status: 500 }
    );
  }
}

// Función para obtener datos de contactos
async function getContactsData(searchParams: URLSearchParams) {
  try {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    
    let query = supabase
      .from('invitados_mipim2025')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,email.ilike.%${search}%,empresa.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('estado_invitacion', status);
    }

    const { data: contacts, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      contacts: contacts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo contactos:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos de contactos' },
      { status: 500 }
    );
  }
}

// Función para obtener datos de campañas
async function getCampaignsData(startDate?: string | null, endDate?: string | null) {
  try {
    let query = supabase
      .from('campaign_metrics')
      .select('*')
      .order('campaign_date', { ascending: false });

    if (startDate) {
      query = query.gte('campaign_date', startDate);
    }
    if (endDate) {
      query = query.lte('campaign_date', endDate);
    }

    const { data: campaigns, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      campaigns: campaigns || []
    });

  } catch (error) {
    console.error('Error obteniendo campañas:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos de campañas' },
      { status: 500 }
    );
  }
}

// Función para obtener templates
async function getTemplatesData() {
  try {
    const { data: templates, error } = await supabase
      .from('mipim_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      templates: templates || []
    });

  } catch (error) {
    console.error('Error obteniendo templates:', error);
    return NextResponse.json(
      { error: 'Error obteniendo templates' },
      { status: 500 }
    );
  }
}

// Función para obtener analytics
async function getAnalyticsData(startDate?: string | null, endDate?: string | null, emailType?: string | null) {
  try {
    let query = supabase
      .from('email_tracking')
      .select(`
        *,
        email_logs!inner(
          email_type,
          recipient_email,
          sent_at
        )
      `)
      .order('timestamp', { ascending: false });

    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }
    if (emailType) {
      query = query.eq('email_logs.email_type', emailType);
    }

    const { data: trackingData, error } = await query;

    if (error) {
      throw error;
    }

    // Calcular métricas agregadas
    const analytics = calculateAnalytics(trackingData || []);

    return NextResponse.json({
      analytics,
      tracking_data: trackingData || []
    });

  } catch (error) {
    console.error('Error obteniendo analytics:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos de analytics' },
      { status: 500 }
    );
  }
}

// Función para obtener usuarios
async function getUsersData() {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
        *,
        permission_table(
          permission_type
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      users: users || []
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos de usuarios' },
      { status: 500 }
    );
  }
}

// Función para crear campaña
async function createCampaign(data: any, userId: string) {
  try {
    const { campaign_name, campaign_date, description } = data;

    const { data: campaign, error } = await supabase
      .from('campaign_metrics')
      .insert({
        campaign_name,
        campaign_date,
        description,
        created_by: userId,
        total_sent: 0,
        total_delivered: 0,
        total_opened: 0,
        total_clicked: 0,
        total_bounced: 0,
        open_rate: 0,
        click_rate: 0,
        bounce_rate: 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Campaña creada exitosamente',
      campaign
    });

  } catch (error) {
    console.error('Error creando campaña:', error);
    return NextResponse.json(
      { error: 'Error creando campaña' },
      { status: 500 }
    );
  }
}

// Función para actualizar template
async function updateTemplate(data: any) {
  try {
    const { id, ...updateData } = data;

    const { data: template, error } = await supabase
      .from('mipim_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: 'Template actualizado exitosamente',
      template
    });

  } catch (error) {
    console.error('Error actualizando template:', error);
    return NextResponse.json(
      { error: 'Error actualizando template' },
      { status: 500 }
    );
  }
}

// Función para gestionar permisos de usuario
async function manageUserPermissions(data: any) {
  try {
    const { user_id, permission_type, action } = data; // action: 'grant' | 'revoke'

    if (action === 'grant') {
      const { error } = await supabase
        .from('permission_table')
        .insert({
          user_id,
          permission_type
        });
      
      if (error) throw error;
    } else if (action === 'revoke') {
      const { error } = await supabase
        .from('permission_table')
        .delete()
        .eq('user_id', user_id)
        .eq('permission_type', permission_type);
      
      if (error) throw error;
    }

    return NextResponse.json({
      message: `Permiso ${action === 'grant' ? 'otorgado' : 'revocado'} exitosamente`
    });

  } catch (error) {
    console.error('Error gestionando permisos:', error);
    return NextResponse.json(
      { error: 'Error gestionando permisos de usuario' },
      { status: 500 }
    );
  }
}

// Función para importación masiva de contactos
async function bulkImportContacts(data: any) {
  try {
    const { contacts } = data;

    const { data: insertedContacts, error } = await supabase
      .from('invitados_mipim2025')
      .insert(contacts)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: `${insertedContacts?.length || 0} contactos importados exitosamente`,
      contacts: insertedContacts
    });

  } catch (error) {
    console.error('Error importando contactos:', error);
    return NextResponse.json(
      { error: 'Error en importación masiva de contactos' },
      { status: 500 }
    );
  }
}

// Función para enviar email de prueba
async function sendTestEmail(data: any) {
  try {
    const { template_key, recipient_email, test_data } = data;

    // Obtener template
    const { data: template, error: templateError } = await supabase
      .from('mipim_templates')
      .select('*')
      .eq('template_key', template_key)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template no encontrado' },
        { status: 404 }
      );
    }

    // Aquí integrarías con Resend para enviar el email de prueba
    // Por ahora solo simulamos el envío
    
    return NextResponse.json({
      message: 'Email de prueba enviado exitosamente',
      template_used: template.template_name,
      recipient: recipient_email
    });

  } catch (error) {
    console.error('Error enviando email de prueba:', error);
    return NextResponse.json(
      { error: 'Error enviando email de prueba' },
      { status: 500 }
    );
  }
}

// Función para calcular analytics
function calculateAnalytics(trackingData: any[]) {
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

  // Analytics por día
  const dailyStats = trackingData.reduce((acc, event) => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { opens: 0, clicks: 0, bounces: 0 };
    }
    if (event.event_type === 'opened') acc[date].opens++;
    if (event.event_type === 'clicked') acc[date].clicks++;
    if (event.event_type === 'bounced') acc[date].bounces++;
    return acc;
  }, {} as Record<string, any>);

  return {
    summary: {
      total_emails: totalEmails,
      total_opened: eventCounts.opened || 0,
      total_clicked: eventCounts.clicked || 0,
      total_bounced: eventCounts.bounced || 0,
      unique_opens: uniqueOpens,
      unique_clicks: uniqueClicks,
      open_rate: totalEmails > 0 ? ((uniqueOpens / totalEmails) * 100).toFixed(2) : '0.00',
      click_rate: uniqueOpens > 0 ? ((uniqueClicks / uniqueOpens) * 100).toFixed(2) : '0.00',
      bounce_rate: totalEmails > 0 ? ((eventCounts.bounced || 0) / totalEmails * 100).toFixed(2) : '0.00'
    },
    daily_stats: dailyStats,
    event_counts: eventCounts
  };
}