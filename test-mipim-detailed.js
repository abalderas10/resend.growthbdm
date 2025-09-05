const { Resend } = require('resend');

// Configuración
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_dasBV1Zg_AMiUPvNEbckHW61U3hJYK8ZX';
const FROM_EMAIL = 'mipim@aliest.growthbdm.com';
const TO_EMAIL = 'abalderas@growthbdm.com';

const resend = new Resend(RESEND_API_KEY);

function generateMagicLink(baseUrl, email) {
  const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
  return `${baseUrl}/confirm?token=${token}`;
}

// Template HTML simple para prueba
function createMipimHtmlTemplate(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invitación MIPIM 2026</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">MIPIM 2026 México</h1>
    <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">La Feria Mundial de Real Estate más Grande del Mundo</p>
  </div>
  
  <div style="background: white; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Hola ${data.recipientName},</h2>
    
    <p>Te invitamos cordialmente al evento más prestigioso del sector inmobiliario internacional.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #667eea; margin-top: 0;">Detalles del Evento</h3>
      <p><strong>📅 Fecha:</strong> ${data.eventDate}</p>
      <p><strong>📍 Ubicación:</strong> ${data.eventLocation}</p>
    </div>
    
    <p>${data.customMessage}</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.magicLinkUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">✅ Confirmar Asistencia</a>
    </div>
    
    <p style="font-size: 14px; color: #666;">O copia y pega este enlace en tu navegador:<br>
    <a href="${data.magicLinkUrl}" style="color: #667eea;">${data.magicLinkUrl}</a></p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
      <h3 style="color: #333; margin-top: 0;">¿Por qué MIPIM?</h3>
      <ul style="color: #666; padding-left: 20px;">
        <li>Acceso a proyectos pre-lanzamiento</li>
        <li>Condiciones preferenciales de inversión</li>
        <li>Asesoría personalizada de expertos</li>
        <li>Materiales exclusivos del evento</li>
        <li>Seguimiento post-evento</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px;">
      <p><strong>Aliest Growth</strong><br>
      📧 Email: ${data.recipientEmail}<br>
      🌐 Web: www.aliestgrowth.com</p>
      
      <p style="margin-top: 20px;">Este email fue enviado a ${data.recipientEmail}</p>
    </div>
  </div>
</body>
</html>
  `;
}

async function testMipimEmail() {
  try {
    console.log('🔧 Configuración del test:');
    console.log(`📧 Destinatario: ${TO_EMAIL}`);
    console.log(`📤 Remitente: ${FROM_EMAIL}`);
    console.log(`🔑 API Key: ${RESEND_API_KEY.substring(0, 10)}...`);
    
    // Generar magic link
    const magicLinkUrl = generateMagicLink('https://mipim.aliest.growthbdm.com', TO_EMAIL);
    console.log(`🔗 Magic Link: ${magicLinkUrl}`);
    
    // Datos del template
    const templateData = {
      recipientName: 'Alejandro Balderas',
      recipientEmail: TO_EMAIL,
      magicLinkUrl: magicLinkUrl,
      eventDate: '10 de Septiembre, 2025',
      eventLocation: 'Neuchatel, Ciudad de México',
      customMessage: 'Esta es una prueba detallada del sistema de correos MIPIM con template HTML directo.'
    };
    
    // Crear HTML
    console.log('🎨 Generando template HTML...');
    const htmlContent = createMipimHtmlTemplate(templateData);
    console.log(`📄 HTML generado: ${htmlContent.length} caracteres`);
    
    // Enviar correo
    console.log('📨 Enviando correo...');
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: '🎯 Test MIPIM - Invitación Detallada (HTML Directo)',
      html: htmlContent
    });
    
    console.log('✅ Correo enviado exitosamente!');
    console.log('📋 Resultado completo:');
    console.log(JSON.stringify(result, null, 2));
    
    // Verificar el resultado
    if (result.data && result.data.id) {
      console.log(`🆔 ID del correo: ${result.data.id}`);
      console.log('✅ El correo fue procesado por Resend');
      console.log('📬 Revisa tu bandeja de entrada en unos minutos');
    } else if (result.id) {
      console.log(`🆔 ID del correo: ${result.id}`);
      console.log('✅ El correo fue procesado por Resend');
      console.log('📬 Revisa tu bandeja de entrada en unos minutos');
    } else {
      console.log('⚠️ Respuesta inesperada de Resend');
      console.log('Estructura de respuesta:', Object.keys(result));
    }
    
  } catch (error) {
    console.error('❌ Error al enviar correo:');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje:', error.message);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    if (error.cause) {
      console.error('Causa:', error.cause);
    }
    console.error('Stack completo:', error.stack);
  }
}

// Ejecutar test
console.log('🚀 Iniciando test detallado de correo MIPIM...');
testMipimEmail();