/**
 * Script para enviar plantilla MIPIM v3
 * Envía la plantilla más reciente de invitación MIPIM
 */

require('dotenv').config();
const { Resend } = require('resend');

// Importar la plantilla v3 (simulamos la importación con HTML directo)
const resend = new Resend(process.env.RESEND_API_KEY);

// Función para generar magic link único
function generateMagicLink(baseUrl, recipientEmail, recipientName = '', eventId = 'mipim2026') {
  const tokenData = `${recipientEmail}:${eventId}:${Date.now()}:${recipientName}`;
  const token = Buffer.from(tokenData).toString('base64url');
  return `${baseUrl}/ticket/${token}`;
}

// HTML de la plantilla MIPIM v3 (función que recibe magicLinkUrl)
function getMipimV3Template(magicLinkUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Promoción MIPIM - La Feria de Real Estate más Grande del Mundo</title>
</head>
<body style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; margin-bottom: 64px;">
    
    <!-- Header with Aliest Growth Logo -->
    <div style="padding: 20px 30px; background-color: #0066CC; text-align: center;">
      <img src="https://mpeimoornrbahdpszhor.supabase.co/storage/v1/object/public/email-images/logos/aliestGrowth.png" width="200" height="60" alt="Aliest Growth" style="display: block; margin: 0 auto;" />
    </div>

    <!-- Main Title with MIPIM Logo -->
    <div style="padding: 30px 30px 20px; text-align: center;">
      <h1 style="color: #0066CC; font-size: 28px; font-weight: bold; margin: 0; line-height: 1.3;">
        Promoción 
        <img src="https://mpeimoornrbahdpszhor.supabase.co/storage/v1/object/public/email-images/logos/mipim.png" width="120" height="40" alt="MIPIM" style="vertical-align: middle; margin: 0 10px;" />
        La Feria de Real Estate más Grande del Mundo
      </h1>
    </div>

    <!-- Subtitle -->
    <div style="padding: 0 30px 20px; text-align: center;">
      <h2 style="color: #333333; font-size: 20px; font-weight: bold; margin: 0; line-height: 1.4;">
        Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México
      </h2>
    </div>

    <!-- Event Details -->
    <div style="padding: 0 30px 30px; text-align: center;">
      <h3 style="color: #0066CC; font-size: 18px; font-weight: bold; margin: 0; background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
        10 de Septiembre, 2025 | 8:30 a.m. | Neuchatel, Ciudad de México
      </h3>
    </div>

    <!-- Main Content -->
    <div style="padding: 0 30px 40px;">
      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Estimado/a Alberto Balderas,
      </p>
      
      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Desde <strong>GrowthBDM</strong> tenemos el honor de invitarte a participar en el evento de Promoción MIPIM, el evento más prestigioso del sector inmobiliario en Latinoamérica.
      </p>
      
      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${magicLinkUrl}" style="background-color: #0066CC; border-radius: 6px; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; text-align: center; display: inline-block; padding: 14px 28px; border: none;">
          Confirmar asistencia y Generar Boleto
        </a>
      </div>

      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        ¡No te pierdas MIPIM La Feria Inmobiliaria más Grande del Mundo, un evento exclusivo diseñado para líderes C-Level del sector inmobiliario!
      </p>

      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Sumérgete en el futuro del real estate y descubre las claves para la inversión y el desarrollo de negocios a nivel global. Conecta directamente con figuras influyentes y obtén insights estratégicos de:
      </p>

      <!-- Speakers Section -->
      <div style="margin: 30px 0;">
        <h3 style="color: #333333; font-size: 20px; font-weight: bold; margin: 0 0 15px;">Ponentes Destacados</h3>
        
        <div style="margin: 0 0 16px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 12px;">
            <strong>Juan Bravo - MIPIM Latinoamerica:</strong><br/>
            Oportunidades de Inversión y Negocios entre México y el Mundo
          </p>
        </div>

        <div style="margin: 0 0 16px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 12px;">
            <strong>Hines - Desarrollador Inmobiliario Global:</strong><br/>
            Trayectoria, Proyectos Emblemáticos y Visión del Futuro Inmobiliario
          </p>
        </div>

        <div style="margin: 0 0 16px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 12px;">
            <strong>Luis Méndez Trillo - Presidente de Coldwell Banker Commercial:</strong><br/>
            Mercado inmobiliario de oficinas e industrial
          </p>
        </div>

        <div style="margin: 0 0 16px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 12px;">
            <strong>Iñigo Arturo Aragón - Subsecretario de Fomento Económico y Atracción a la Inversión del Estado de Oaxaca:</strong><br/>
            Oportunidades Inversión en el Corredor Interoceánico del Istmo de Tehuantepec
          </p>
        </div>
      </div>

      <!-- Event Details -->
      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #333333; font-size: 18px; font-weight: bold; margin: 0 0 15px;">Detalles del Evento:</h3>
        
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 16px; text-align: center;">
          ====================
        </p>
        
        <div style="margin: 0 0 16px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">
            <strong>Fecha:</strong><br/>
            Miércoles, 10 de septiembre de 2025
          </p>
        </div>
        
        <div style="margin: 0 0 16px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">
            <strong>Hora:</strong><br/>
            8:30 a.m. (Recepción y Desayuno Networking)
          </p>
        </div>
        
        <div style="margin: 0 0 16px;">
          <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 8px;">
            <strong>Sede:</strong><br/>
            Neuchatel, Av. Río San Joaquín 498, Col. Ampliación Granada, Alcaldía Miguel Hidalgo, Ciudad de México.
          </p>
        </div>
        
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0;">
          Este es un evento con cupo estrictamente limitado para garantizar una experiencia de networking de alta calidad. Asegura tu acceso gratuito y sé parte de este encuentro que definirá el futuro de tu negocio.
        </p>
      </div>

      <!-- Ticket Access Section -->
      <div style="background-color: #e8f4fd; border-left: 4px solid #0066CC; padding: 16px 20px; margin: 20px 0;">
        <h3 style="color: #0066CC; font-size: 18px; font-weight: bold; margin: 0 0 10px;">🎫 Acceso directo a tu boleto</h3>
        
        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 12px;">
          Haz clic en el botón de arriba para acceder directamente a tu boleto con código QR. <strong>No necesitas registrarte ni hacer login.</strong>
        </p>
        
        <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
          <a href="${magicLinkUrl}" style="color: #0066CC; text-decoration: underline;">${magicLinkUrl}</a>
        </p>
      </div>

      <hr style="border-color: #e6ebf1; margin: 30px 0;" />

      <!-- Footer -->
      <div style="text-align: center; padding: 20px 0; background-color: #2d3748; margin: 0 -30px; color: #ffffff;">
        <p style="font-size: 16px; margin: 0 0 16px; color: #ffffff;">
          <strong>GrowthBDM</strong><br/>
          Conectando oportunidades globales
        </p>
        
        <p style="font-size: 12px; line-height: 1.4; margin: 0; color: #a0aec0;">
          Si tienes alguna pregunta, no dudes en contactarnos.<br/>
          <a href="mailto:info@growthbdm.com" style="color: #0066CC; text-decoration: underline;">info@growthbdm.com</a>
          {' | '}
          <a href="https://www.growthbdm.com" style="color: #0066CC; text-decoration: underline;">www.growthbdm.com</a>
        </p>
        
        <p style="font-size: 12px; line-height: 1.4; margin: 16px 0 0; color: #a0aec0;">
          © 2025 GrowthBDM. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

async function sendMipimV3Email() {
  try {
    console.log('🚀 Enviando plantilla MIPIM v3...');
    
    // Generar magic link único para el destinatario
    const recipientEmail = 'abalderas10@gmail.com';
    const recipientName = 'Alberto Balderas';
    // Usar URL de producción o staging en lugar de localhost
    const magicLinkUrl = generateMagicLink('http://localhost:3000', recipientEmail, recipientName);
    
    // Generar la plantilla con el magic link
    const finalTemplate = getMipimV3Template(magicLinkUrl);
    
    const { data, error } = await resend.emails.send({
      from: 'MIPIM Growth BDM <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: 'Promoción MIPIM - La Feria de Real Estate más Grande del Mundo',
      html: finalTemplate,
    });

    if (error) {
      console.error('❌ Error al enviar:', error);
      return;
    }

    console.log('✅ Correo enviado exitosamente!');
    console.log('📧 Destinatario: abalderas10@gmail.com');
    console.log('📋 Detalles:', {
      id: data.id,
      from: 'GrowthBDM <onboarding@resend.dev>',
      subject: 'Promoción MIPIM - La Feria de Real Estate más Grande del Mundo',
      template: 'MIPIM v3 - Promoción Evento'
    });
    
  } catch (error) {
    console.error('💥 Error inesperado:', error);
  }
}

// Ejecutar el envío
sendMipimV3Email();