/**
 * Script de prueba para verificar que la API key de Resend funciona correctamente
 * 
 * Para ejecutar este test:
 * node test-email.js
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResendConnection() {
  console.log('🧪 Probando conexión con Resend...');
  console.log('API Key configurada:', process.env.RESEND_API_KEY ? '✅ Sí' : '❌ No');
  
  try {
    // Enviar un email de prueba simple
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Email verificado de Resend para pruebas
      to: ['delivered@resend.dev'],   // Email de prueba de Resend
      subject: '🎉 Prueba de API Key - Sistema de Envío Masivo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">¡API Key Configurada Correctamente! 🚀</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Tu API key de Resend está funcionando perfectamente. El sistema de envío masivo está listo para usar.
          </p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Próximos pasos:</h3>
            <ul style="color: #666;">
              <li>Personalizar templates de email</li>
              <li>Configurar listas de destinatarios</li>
              <li>Probar envío masivo</li>
              <li>Monitorear métricas de entrega</li>
            </ul>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Email enviado desde el sistema de envío masivo con React Email + Resend
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error al enviar email:', error);
      return false;
    }

    console.log('✅ Email enviado exitosamente!');
    console.log('📧 ID del email:', data.id);
    console.log('🎯 El email fue enviado a: delivered@resend.dev');
    console.log('');
    console.log('🎉 ¡Tu API key está configurada correctamente!');
    console.log('💡 Ahora puedes usar el sistema de envío masivo.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('');
      console.log('🔑 Problema con la API key:');
      console.log('   - Verifica que la API key sea correcta');
      console.log('   - Asegúrate de que esté activa en tu cuenta de Resend');
    }
    
    return false;
  }
}

// Función para mostrar información del sistema
function showSystemInfo() {
  console.log('📋 Información del Sistema de Envío Masivo');
  console.log('=' .repeat(50));
  console.log('🔧 Configuración actual:');
  console.log('   - API Key:', process.env.RESEND_API_KEY ? 'Configurada ✅' : 'No configurada ❌');
  console.log('   - URL de la app:', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001');
  console.log('   - Lote máximo:', process.env.MAX_EMAILS_PER_BATCH || '50');
  console.log('   - Delay entre lotes:', process.env.DELAY_BETWEEN_BATCHES || '2000ms');
  console.log('');
}

// Ejecutar el test
async function runTest() {
  showSystemInfo();
  
  const success = await testResendConnection();
  
  if (success) {
    console.log('');
    console.log('🚀 Comandos útiles:');
    console.log('   - Ejecutar aplicación: cd apps/web && pnpm dev');
    console.log('   - Ver ejemplos: cat examples/mass-email-example.ts');
    console.log('   - Leer guía: cat BULK_EMAIL_GUIDE.md');
    console.log('');
    console.log('📡 API disponible en: http://localhost:3001/api/send-campaign');
  } else {
    console.log('');
    console.log('🔧 Para solucionar problemas:');
    console.log('   1. Verifica tu API key en .env.local');
    console.log('   2. Asegúrate de tener una cuenta activa en Resend');
    console.log('   3. Revisa la documentación en BULK_EMAIL_GUIDE.md');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runTest();
}

module.exports = { testResendConnection, showSystemInfo };