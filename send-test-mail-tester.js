// Script para enviar correo de prueba a mail-tester.com para diagnóstico
const { Resend } = require('resend');
require('dotenv').config({ path: './.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    console.log('🔍 Enviando correo de prueba para diagnóstico...');
    console.log('📧 API Key:', process.env.RESEND_API_KEY ? 'Configurada' : 'NO CONFIGURADA');
    console.log('🌐 Dominio:', process.env.FROM_EMAIL || 'noreply@aliest.growthbdm.com');
    
    // Generar ID único para mail-tester
    const testId = Math.random().toString(36).substring(2, 15);
    const testEmail = `test-${testId}@mail-tester.com`;
    
    console.log(`📬 Enviando a: ${testEmail}`);
    
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@aliest.growthbdm.com',
      to: [testEmail],
      subject: 'Prueba de configuración DNS - MIPIM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Prueba de Configuración DNS</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #666; margin-top: 0;">Información del Test:</h3>
            <p><strong>Test ID:</strong> ${testId}</p>
            <p><strong>Dominio:</strong> aliest.growthbdm.com</p>
            <p><strong>Fecha:</strong> ${new Date().toISOString()}</p>
            <p><strong>Propósito:</strong> Verificar configuración DNS para entrega de correos MIPIM</p>
          </div>
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3;">
            <h3 style="color: #1976D2; margin-top: 0;">Registros DNS Detectados:</h3>
            <ul style="color: #333;">
              <li>✅ DKIM: Configurado (resend selector)</li>
              <li>❌ SPF: No encontrado</li>
              <li>❌ MX: Vacío o mal configurado</li>
            </ul>
          </div>
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Este correo es parte de las pruebas de configuración del sistema de invitaciones MIPIM.
          </p>
        </div>
      `,
      headers: {
        'X-Entity-Ref-ID': `mipim_test_${testId}`,
        'X-Test-Purpose': 'DNS-Configuration-Check'
      }
    });

    console.log('✅ Correo enviado exitosamente!');
    console.log('📊 Detalles de envío:', JSON.stringify(data, null, 2));
    console.log('');
    console.log('🔗 Para ver el análisis completo, visita:');
    console.log(`   https://www.mail-tester.com/${testId}`);
    console.log('');
    console.log('⏱️  Espera unos minutos y luego visita el enlace para ver el reporte de entregabilidad.');
    
    return data;
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
    throw error;
  }
}

sendTestEmail()
  .then(() => {
    console.log('\n🎯 Test completado. Revisa el enlace de mail-tester para diagnóstico detallado.');
  })
  .catch((error) => {
    console.error('\n💥 Error en el test:', error.message);
    process.exit(1);
  });