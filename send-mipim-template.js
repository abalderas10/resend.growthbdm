const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Configuración
const RESEND_API_KEY = 're_dasBV1Zg_AMiUPvNEbckHW61U3hJYK8ZX';
const FROM_EMAIL = 'noreply@aliest.growthbdm.com';
const TO_EMAIL = 'abalderas10@gmail.com';

// Inicializar Resend
const resend = new Resend(RESEND_API_KEY);

// Función para generar magic link
function generateMagicLink(baseUrl, email, eventId = 'mipim2026') {
  const token = Buffer.from(`${email}:${eventId}:${Date.now()}`).toString('base64');
  return `${baseUrl}/confirm/${token}`;
}

// Plantilla MIPIM completa en HTML
function createMipimTemplate(props) {
  const {
    recipientName = 'Estimado/a invitado/a',
    recipientEmail,
    magicLinkUrl,
    eventDate = '10 de Septiembre, 2025',
    eventLocation = 'Neuchatel, Ciudad de México',
    customMessage = ''
  } = props;

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invitación MIPIM 2026 México</title>
</head>
<body style="background-color: #f6f9fc; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif; margin: 0; padding: 0;">
    <div style="background-color: #ffffff; margin: 0 auto; padding: 20px 0 48px; margin-bottom: 64px; max-width: 600px;">
        
        <!-- Logo Section -->
        <div style="background-color: #1a365d; padding: 20px; text-align: center;">
            <img src="https://mipim.growthbdm.com/logo-white.png" width="200" height="60" alt="MIPIM Logo" style="margin: 0 auto;" />
        </div>

        <!-- Header -->
        <div style="background-color: #2d3748; padding: 30px 20px; text-align: center; color: #ffffff;">
            <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 5px 0; color: #ffffff;">Aliest Growth</h1>
            <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 5px 0; color: #ffffff;">Promoción</h2>
            <h1 style="font-size: 36px; font-weight: bold; margin: 10px 0; color: #ffd700; text-transform: uppercase; letter-spacing: 2px;">MIPIM</h1>
            <p style="font-size: 16px; margin: 10px 0; color: #e2e8f0; font-style: italic;">La Feria Mundial de Real Estate más Grande del Mundo</p>
            <p style="font-size: 14px; margin: 15px 0 5px 0; color: #cbd5e0;">Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México</p>
            <p style="font-size: 16px; font-weight: bold; margin: 15px 0 0 0; color: #ffd700;">${eventDate} | 8:30 a.m. | ${eventLocation}</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 40px;">
            <p style="font-size: 18px; font-weight: bold; margin: 0 0 20px 0; color: #2d3748;">Hola ${recipientName},</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">
                Nos complace invitarte a la <strong>Promoción MIPIM 2026 México</strong>, el evento más prestigioso del sector inmobiliario a nivel mundial.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">
                Este evento exclusivo reunirá a los principales líderes, desarrolladores e inversionistas del sector inmobiliario para explorar las oportunidades más prometedoras en México y Europa.
            </p>

            ${customMessage ? `<p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">${customMessage}</p>` : ''}

            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">
                <strong>Detalles del evento:</strong>
            </p>
            
            <div style="font-size: 16px; line-height: 1.8; margin: 16px 0; padding: 20px; background-color: #f7fafc; border-left: 4px solid #3182ce; color: #2d3748;">
                📅 <strong>Fecha:</strong> ${eventDate}<br/>
                🕰️ <strong>Hora:</strong> 8:30 a.m.<br/>
                📍 <strong>Ubicación:</strong> ${eventLocation}<br/>
                🎯 <strong>Enfoque:</strong> Oportunidades de Desarrollo e Inversión
            </div>

            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">
                Durante el evento podrás:
            </p>

            <div style="font-size: 16px; line-height: 1.8; margin: 16px 0; color: #4a5568; padding-left: 20px;">
                • Conocer proyectos inmobiliarios exclusivos en México y Europa<br/>
                • Conectar con inversionistas y desarrolladores de primer nivel<br/>
                • Explorar oportunidades de inversión con alto potencial de retorno<br/>
                • Participar en presentaciones de proyectos innovadores<br/>
                • Networking con profesionales del sector inmobiliario
            </div>
        </div>

        <!-- CTA Section -->
        <div style="padding: 30px 40px; text-align: center; background-color: #f7fafc;">
            <p style="font-size: 18px; font-weight: bold; margin: 0 0 20px 0; color: #2d3748;">
                Confirma tu asistencia haciendo clic en el siguiente enlace:
            </p>
            
            <a href="${magicLinkUrl}" style="background-color: #3182ce; border-radius: 8px; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; text-align: center; display: inline-block; padding: 16px 32px; margin: 0 0 20px 0;">
                Confirmar Asistencia
            </a>

            <p style="font-size: 14px; margin: 20px 0 0 0; color: #718096;">
                O copia y pega este enlace en tu navegador:<br/>
                <a href="${magicLinkUrl}" style="color: #3182ce; text-decoration: underline;">${magicLinkUrl}</a>
            </p>
        </div>

        <hr style="border-color: #e2e8f0; margin: 30px 40px;" />

        <!-- Additional Info -->
        <div style="padding: 0 40px 30px;">
            <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #2d3748;">¿Por qué MIPIM?</h3>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">
                MIPIM es reconocido mundialmente como la plataforma líder para profesionales del sector inmobiliario. Con más de 30 años de experiencia, conecta a los principales actores del mercado global.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">
                <strong>Beneficios exclusivos para asistentes:</strong>
            </p>

            <div style="font-size: 16px; line-height: 1.8; margin: 16px 0; color: #4a5568; padding-left: 20px;">
                • Acceso a proyectos pre-lanzamiento<br/>
                • Condiciones preferenciales de inversión<br/>
                • Asesoría personalizada de expertos<br/>
                • Materiales exclusivos del evento<br/>
                • Seguimiento post-evento
            </div>
        </div>

        <hr style="border-color: #e2e8f0; margin: 30px 40px;" />

        <!-- Contact Info -->
        <div style="padding: 0 40px 30px;">
            <h3 style="font-size: 20px; font-weight: bold; margin: 0 0 16px 0; color: #2d3748;">Información de Contacto</h3>
            
            <div style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568; padding: 16px; background-color: #f7fafc; border-radius: 8px;">
                <strong>Aliest Growth</strong><br/>
                📧 Email: ${recipientEmail}<br/>
                🌐 Web: www.aliestgrowth.com<br/>
                📱 WhatsApp: +52 55 1234 5678
            </div>

            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; color: #4a5568;">
                Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos. Nuestro equipo estará encantado de asistirte.
            </p>
        </div>

        <!-- Footer -->
        <div style="padding: 20px 40px; text-align: center; background-color: #2d3748;">
            <p style="font-size: 16px; margin: 0 0 16px 0; color: #ffffff;">
                Esperamos verte en este evento exclusivo.<br/>
                <strong>Equipo Aliest Growth</strong>
            </p>
            
            <p style="font-size: 12px; line-height: 1.4; margin: 0; color: #a0aec0;">
                Este es un evento por invitación únicamente. La confirmación de asistencia es requerida.
                Si no deseas recibir más invitaciones, puedes darte de baja respondiendo a este correo.
            </p>
        </div>
    </div>
</body>
</html>
`;
}

async function sendMipimInvitation() {
    try {
        console.log('🏢 Enviando invitación MIPIM...');
        console.log(`📧 Destinatario: ${TO_EMAIL}`);
        console.log(`📤 Remitente: ${FROM_EMAIL}`);
        
        // Generar magic link
        const magicLinkUrl = generateMagicLink('https://mipim.aliest.growthbdm.com', TO_EMAIL);
        console.log(`🔗 Magic Link: ${magicLinkUrl}`);
        
        // Crear plantilla con datos
        const htmlTemplate = createMipimTemplate({
            recipientName: 'Alejandro Balderas',
            recipientEmail: TO_EMAIL,
            magicLinkUrl: magicLinkUrl,
            eventDate: '10 de Septiembre, 2025',
            eventLocation: 'Neuchatel, Ciudad de México',
            customMessage: 'Esta es una invitación de prueba para verificar la plantilla MIPIM con el diseño completo y profesional.'
        });
        
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: TO_EMAIL,
            subject: '🎯 Invitación Exclusiva MIPIM 2026 México - Confirma tu Asistencia',
            html: htmlTemplate
        });
        
        console.log('✅ Invitación MIPIM enviada exitosamente!');
        console.log('📋 Detalles del envío:');
        console.log(JSON.stringify(result, null, 2));
        
        // Guardar resultado
        const reportData = {
            timestamp: new Date().toISOString(),
            success: true,
            recipient: TO_EMAIL,
            sender: FROM_EMAIL,
            subject: '🎯 Invitación Exclusiva MIPIM 2026 México - Confirma tu Asistencia',
            magicLinkUrl: magicLinkUrl,
            result: result,
            message: 'Invitación MIPIM enviada exitosamente con plantilla completa'
        };
        
        fs.writeFileSync(
            path.join(__dirname, 'mipim-invitation-sent-report.json'),
            JSON.stringify(reportData, null, 2)
        );
        
        console.log('\n📄 Reporte guardado en: mipim-invitation-sent-report.json');
        console.log('\n🎉 ¡Invitación MIPIM enviada con diseño profesional completo!');
        
    } catch (error) {
        console.error('❌ Error al enviar la invitación MIPIM:');
        console.error(error);
        
        // Guardar error
        const errorData = {
            timestamp: new Date().toISOString(),
            success: false,
            recipient: TO_EMAIL,
            sender: FROM_EMAIL,
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            }
        };
        
        fs.writeFileSync(
            path.join(__dirname, 'mipim-invitation-error-report.json'),
            JSON.stringify(errorData, null, 2)
        );
        
        console.log('\n📄 Reporte de error guardado en: mipim-invitation-error-report.json');
    }
}

// Ejecutar el envío
sendMipimInvitation();