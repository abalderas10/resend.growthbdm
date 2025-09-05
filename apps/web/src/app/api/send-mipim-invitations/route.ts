import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializar Resend solo si hay una clave válida
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('ejemplo')) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface Recipient {
  email: string;
  name: string;
  magicLinkUrl?: string;
}

interface MipimInvitationRequest {
  subject: string;
  recipients: Recipient[];
  eventDate?: string;
  eventLocation?: string;
  customMessage?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    const expectedToken = `Bearer ${process.env.API_SECRET_KEY}`;
    
    if (!authHeader || authHeader !== expectedToken) {
      return NextResponse.json(
        { error: 'No autorizado', details: 'Token de API inválido' },
        { status: 401 }
      );
    }

    const body: MipimInvitationRequest = await request.json();
    const { subject, recipients, eventDate, eventLocation, customMessage } = body;

    // Verificar configuración de Resend
    if (!resend) {
      // Simular envío exitoso para pruebas
      const simulatedResults = recipients.map((recipient, index) => ({
        messageId: `sim_${Date.now()}_${index}`,
        email: recipient.email,
        status: 'simulated'
      }));
      
      return NextResponse.json({
        success: true,
        message: 'Envío simulado exitosamente (RESEND_API_KEY no configurada)',
        campaignId: `sim_campaign_${Date.now()}`,
        emailsSent: recipients.length,
        results: simulatedResults
      });
    }

    // Validaciones
    if (!subject || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: 'Subject y recipients son requeridos' },
        { status: 400 }
      );
    }

    // Límite de destinatarios
    const maxRecipients = parseInt(process.env.MAX_RECIPIENTS || '100');
    if (recipients.length > maxRecipients) {
      return NextResponse.json(
        { 
          error: 'Límite excedido', 
          details: `Máximo ${maxRecipients} destinatarios permitidos` 
        },
        { status: 400 }
      );
    }

    // Validar emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const recipient of recipients) {
      if (!recipient.email || !emailRegex.test(recipient.email)) {
        return NextResponse.json(
          { error: 'Email inválido', details: `Email inválido: ${recipient.email}` },
          { status: 400 }
        );
      }
    }

    // Enviar emails
    const results = [];
    const campaignId = `mipim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    for (const recipient of recipients) {
      try {
        const emailData = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'mipim@aliest.growthbdm.com',
          to: [recipient.email],
          subject: subject,
          html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitación MIPIM 2026 México</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
    
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>'); opacity: 0.3;"></div>
      <div style="position: relative; z-index: 2;">
        <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); letter-spacing: -0.5px;">MIPIM 2026</h1>
        <p style="color: #e2e8f0; font-size: 18px; margin: 0; font-weight: 300;">Promoción México</p>
        <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #ffd700, #ffed4e); margin: 20px auto; border-radius: 2px;"></div>
      </div>
    </div>
    
    <!-- Main content -->
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #2d3748; font-size: 24px; font-weight: 600; margin: 0 0 15px 0; line-height: 1.3;">Invitación Exclusiva</h2>
        <p style="color: #4a5568; font-size: 16px; margin: 0; line-height: 1.6;">Hola <strong style="color: #2d3748;">${recipient.name}</strong>,</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #667eea;">
        <p style="color: #2d3748; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">Te invitamos cordialmente a participar en la <strong>Promoción MIPIM 2026 México</strong>, el evento más prestigioso del sector inmobiliario mundial.</p>
        
        ${customMessage ? `<div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 3px solid #ffd700; margin: 20px 0;"><p style="color: #2d3748; font-size: 15px; line-height: 1.6; margin: 0; font-style: italic;">${customMessage}</p></div>` : ''}
      </div>
      
      <!-- Event details card -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h3 style="color: #2d3748; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">📅 Detalles del Evento</h3>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; font-weight: 500;">Fecha:</span>
          <span style="color: #4a5568; margin-left: 10px;">${eventDate || 'Próximamente'}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; font-weight: 500;">Hora:</span>
          <span style="color: #4a5568; margin-left: 10px;">8:30 a.m.</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; font-weight: 500;">Ubicación:</span>
          <span style="color: #4a5568; margin-left: 10px;">${eventLocation || 'Por confirmar'}</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; font-weight: 500;">Enfoque:</span>
          <span style="color: #4a5568; margin-left: 10px;">Oportunidades de Desarrollo e Inversión</span>
        </div>
      </div>
      
      <!-- Benefits section -->
      <div style="margin: 30px 0;">
        <h3 style="color: #2d3748; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">Durante el evento podrás:</h3>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; margin-right: 12px; font-size: 18px;">🏢</span>
          <span style="color: #4a5568; line-height: 1.6;">Conocer proyectos inmobiliarios exclusivos en México y Europa</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; margin-right: 12px; font-size: 18px;">🤝</span>
          <span style="color: #4a5568; line-height: 1.6;">Conectar con inversionistas y desarrolladores de primer nivel</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; margin-right: 12px; font-size: 18px;">💰</span>
          <span style="color: #4a5568; line-height: 1.6;">Explorar oportunidades de inversión con alto potencial de retorno</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; margin-right: 12px; font-size: 18px;">🎯</span>
          <span style="color: #4a5568; line-height: 1.6;">Participar en presentaciones de proyectos innovadores</span>
        </div>
        <div style="margin-bottom: 12px;">
          <span style="color: #667eea; margin-right: 12px; font-size: 18px;">🌐</span>
          <span style="color: #4a5568; line-height: 1.6;">Networking con profesionales del sector inmobiliario</span>
        </div>
      </div>
    </div>
    
    <!-- CTA Section -->
    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 30px; text-align: center;">
      <h3 style="color: #2d3748; font-size: 20px; font-weight: 600; margin: 0 0 20px 0;">Confirma tu asistencia</h3>
      <p style="color: #4a5568; font-size: 16px; margin: 0 0 25px 0; line-height: 1.6;">Haz clic en el siguiente enlace para confirmar tu participación:</p>
      
      <a href="${recipient.magicLinkUrl || `https://mipim.aliest.growthbdm.com/registro/${recipient.email}`}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">✨ Confirmar Asistencia</a>
      
      <p style="color: #718096; font-size: 14px; margin: 25px 0 0 0; line-height: 1.5;">O copia y pega este enlace en tu navegador:<br/><a href="${recipient.magicLinkUrl || `https://mipim.aliest.growthbdm.com/registro/${recipient.email}`}" style="color: #667eea; text-decoration: underline; word-break: break-all;">${recipient.magicLinkUrl || `https://mipim.aliest.growthbdm.com/registro/${recipient.email}`}</a></p>
    </div>
    
    <!-- Footer -->
    <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); padding: 30px; text-align: center; color: #ffffff;">
      <p style="font-size: 16px; margin: 0 0 15px 0; font-weight: 500;">Esperamos verte en este evento exclusivo</p>
      <p style="font-size: 18px; margin: 0 0 20px 0; font-weight: 600; color: #ffd700;">Equipo Aliest Growth</p>
      
      <div style="border-top: 1px solid #4a5568; padding-top: 20px; margin-top: 20px;">
        <p style="font-size: 12px; color: #a0aec0; margin: 0; line-height: 1.5;">Este es un evento por invitación únicamente. La confirmación de asistencia es requerida.<br/>Si no deseas recibir más invitaciones, puedes darte de baja respondiendo a este correo.</p>
      </div>
    </div>
  </div>
</body>
</html>
        `,
          headers: {
            'X-Campaign-ID': campaignId,
            'X-Campaign-Type': 'mipim-invitation'
          }
        });

        results.push({
          email: recipient.email,
          messageId: emailData.data?.id,
          status: 'sent'
        });
      } catch (error) {
        console.error(`Error enviando a ${recipient.email}:`, error);
        results.push({
          email: recipient.email,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    return NextResponse.json({
      success: true,
      campaignId,
      campaignType: 'mipim-invitation',
      emailsSent: successCount,
      emailsFailed: failedCount,
      totalRecipients: recipients.length,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en send-mipim-invitations:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor', 
        details: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint para envío de invitaciones MIPIM',
    method: 'POST',
    description: 'Envía invitaciones personalizadas para eventos MIPIM'
  });
}