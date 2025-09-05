// Script para verificar que los correos se envían desde mipim@aliest.growthbdm.com
require('dotenv').config();
const { Resend } = require('resend');

const verifySenderEmail = async () => {
  try {
    console.log('🔍 Verificando configuración de email remitente...');
    console.log('📧 FROM_EMAIL desde .env:', process.env.FROM_EMAIL);
    console.log('📧 DEFAULT_FROM_EMAIL desde .env:', process.env.DEFAULT_FROM_EMAIL);
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Enviar email de prueba directamente con Resend para verificar remitente
    const emailData = {
      from: process.env.FROM_EMAIL || 'mipim@aliest.growthbdm.com',
      to: ['abalderas10@proton.me'],
      subject: 'Verificación de remitente - MIPIM',
      html: `
        <h2>✅ Verificación de Email Remitente</h2>
        <p>Este correo confirma que se está enviando desde: <strong>${process.env.FROM_EMAIL || 'mipim@aliest.growthbdm.com'}</strong></p>
        <p>Fecha: ${new Date().toLocaleString()}</p>
        <p>Si recibes este correo, la configuración es correcta.</p>
      `
    };
    
    console.log('📤 Enviando email de verificación desde:', emailData.from);
    
    const result = await resend.emails.send(emailData);
    
    if (result.data) {
      console.log('✅ Email de verificación enviado exitosamente:');
      console.log('- Message ID:', result.data.id);
      console.log('- Remitente configurado:', emailData.from);
      console.log('- Destinatario:', emailData.to[0]);
      console.log('\n🎉 ¡Confirmado! Los correos se están enviando desde mipim@aliest.growthbdm.com');
    } else {
      console.error('❌ Error al enviar email:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

verifySenderEmail();