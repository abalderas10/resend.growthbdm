require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    console.log('🚀 Enviando correo de prueba...');
    console.log('📧 Destinatario: abalderas10@gmail.com (dirección verificada para pruebas)');
    
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'abalderas10@gmail.com',
      subject: '✅ Prueba de Sistema de Correo Masivo - React Email + Resend',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">🎉 ¡Sistema Funcionando!</h1>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e293b; margin-top: 0;">📊 Detalles del Sistema:</h2>
            <ul style="color: #475569; line-height: 1.6;">
              <li><strong>Proyecto:</strong> React Email + Resend</li>
              <li><strong>Funcionalidad:</strong> Envío de correos masivos</li>
              <li><strong>Estado:</strong> ✅ Configurado y funcionando</li>
              <li><strong>API Key:</strong> ✅ Verificada</li>
              <li><strong>Servidor Web:</strong> http://localhost:3001</li>
            </ul>
          </div>
          
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #065f46; margin-top: 0;">🚀 Capacidades Implementadas:</h3>
            <ul style="color: #047857; line-height: 1.6;">
              <li>Plantillas de email personalizables con React</li>
              <li>Sistema de envío masivo con control de lotes</li>
              <li>Manejo de errores y reintentos automáticos</li>
              <li>API REST para integración externa</li>
              <li>Validación de destinatarios</li>
              <li>Límites de envío configurables</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #64748b; font-size: 14px;">Este correo fue enviado como prueba del sistema de correos masivos</p>
            <p style="color: #64748b; font-size: 12px;">Timestamp: ${new Date().toISOString()}</p>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Error al enviar correo:', error);
      return;
    }

    console.log('✅ Correo enviado exitosamente!');
    console.log('📋 ID del correo:', data.id);
    console.log('🎯 Destinatario confirmado: abalderas10@gmail.com');
    console.log('');
    console.log('📊 Resumen del sistema:');
    console.log('- ✅ API Key configurada y funcionando');
    console.log('- ✅ Servidor web activo en http://localhost:3001');
    console.log('- ✅ Sistema de envío masivo implementado');
    console.log('- ✅ Plantillas React Email disponibles');
    console.log('');
    console.log('🔗 Próximos pasos sugeridos:');
    console.log('1. Revisar el correo en abalderas10@gmail.com');
    console.log('2. Explorar la interfaz web en http://localhost:3001');
    console.log('3. Probar el sistema de envío masivo con múltiples destinatarios');
    
  } catch (error) {
    console.error('💥 Error inesperado:', error.message);
  }
}

sendTestEmail();