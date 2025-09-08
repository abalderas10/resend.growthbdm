import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializar Resend solo si hay una clave válida
let resend: Resend | null = null;
console.log('🔍 Debug RESEND_API_KEY:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 15)}...` : 'undefined');
if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('ejemplo')) {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend inicializado correctamente');
} else {
  console.log('❌ Resend NO inicializado - API key no válida o contiene "ejemplo"');
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
        // Plantilla MIPIM profesional implementada
        const emailData = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'mipim@aliest.growthbdm.com',
          to: [recipient.email],
          subject: subject,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitación MIPIM 2026 México</title>
</head>
<body style="background-color: #f6f9fc; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif; margin: 0; padding: 0;">
  <div style="background-color: #ffffff; margin: 0 auto; padding: 0; max-width: 600px;">
    
    <!-- Logo Section -->
    <div style="background-color: #1a365d; padding: 20px; text-align: center;">
      <img src="https://mipim.growthbdm.com/logo-aliest-growth.png" width="200" height="60" alt="Aliest-Growth Logo" style="margin: 0 auto;" />
    </div>

    <!-- Header -->
    <div style="background-color: #2c5aa0; padding: 30px 20px; text-align: center; color: #ffffff;">
      <p style="font-size: 14px; font-weight: normal; margin: 0 0 10px; color: #ffffff;">Aliest Growth</p>
      <p style="font-size: 14px; font-weight: normal; margin: 0 0 10px; color: #ffffff;">Promoción</p>
      <p style="font-size: 48px; font-weight: bold; margin: 0 0 10px; color: #ffffff; letter-spacing: 2px;">MIPIM</p>
      <p style="font-size: 18px; font-weight: bold; margin: 0 0 20px; color: #ffffff;">La Feria Mundial de Real Estate más Grande del Mundo</p>
      <p style="font-size: 14px; margin: 0 0 20px; color: #ffffff; font-style: italic;">Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México</p>
      <p style="font-size: 16px; font-weight: bold; margin: 0; color: #ffffff;">${eventDate || '10 de Septiembre, 2025'} | 8:30 a.m. | ${eventLocation || 'Neuchatel, Ciudad de México'}</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 30px;">
      <p style="font-size: 18px; font-weight: bold; margin: 0 0 20px; color: #2c5aa0;">Estimado/a ${recipient.name},</p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">Desde GrowthBDM tenemos el honor de invitarte a participar al evento de Promoción MIPIM 2026 México, el evento más prestigioso del sector inmobiliario en Latinoamérica.</p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">¡No te pierdas MIPIM La Feria Inmobiliaria más Grande del Mundo, un evento exclusivo diseñado para líderes C-Level del sector inmobiliario!</p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">Sumérgete en el futuro del real estate y descubre las claves para la inversión y el desarrollo de negocios a nivel global. Conecta directamente con figuras influyentes y obtén insights estratégicos de ponentes.</p>

      <!-- CTA Section -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${recipient.magicLinkUrl || `https://mipim.aliest.growthbdm.com/registro/${recipient.email}`}" style="background-color: #2c5aa0; border-radius: 8px; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; text-align: center; display: inline-block; padding: 16px 32px; border: none; cursor: pointer;">Obtener Mi Boleto Aliest-Growth Promoción MIPIM</a>
        <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0; font-style: italic;">No necesitas registrarte</p>
      </div>

      <!-- Event Details Section -->
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
        <p style="font-size: 20px; font-weight: bold; margin: 0 0 15px; color: #2c5aa0;">Detalles del Evento:</p>
        <hr style="border-color: #e5e7eb; margin: 16px 0;" />
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 8px 0;"><strong>Fecha:</strong> ${eventDate || '10 de Septiembre, 2025'}</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 8px 0;"><strong>Hora:</strong> 8:30 a.m.</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 8px 0;"><strong>Sede:</strong> ${eventLocation || 'Neuchatel, Ciudad de México'}</p>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">Este es un evento con cupo estrictamente limitado para garantizar una experiencia de networking de alta calidad. Asegura tu acceso gratuito y sé parte de este encuentro que definirá el futuro de tu negocio.</p>

      <!-- Ticket Access -->
      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="font-size: 20px; font-weight: bold; margin: 0 0 15px; color: #2c5aa0;">🎫 Acceso directo a tu boleto</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">Haz clic en el botón de arriba para acceder directamente a tu boleto con código QR.</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="margin: 16px 0;">
          <a href="${recipient.magicLinkUrl || `https://mipim.aliest.growthbdm.com/registro/${recipient.email}`}" style="color: #2c5aa0; font-size: 14px; text-decoration: underline; word-break: break-all;">${recipient.magicLinkUrl || `https://mipim.aliest.growthbdm.com/registro/${recipient.email}`}</a>
        </p>
      </div>

      ${customMessage ? `<div style="color: #2d3748; font-size: 16px; font-style: italic; line-height: 1.6; margin: 20px 0; padding: 16px; background-color: #edf2f7; border-left: 4px solid #2c5aa0;"><p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 16px 0;">${customMessage}</p></div>` : ''}
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