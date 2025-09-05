// Script para enviar correo de prueba MIPIM
require('dotenv').config();

const sendTestMipimEmail = async () => {
  try {
    console.log('Enviando correo de prueba MIPIM...');
    
    const response = await fetch('http://localhost:3000/api/send-mipim-invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer mipim_secret_key_2025_growthbdm`
      },
      body: JSON.stringify({
        subject: 'Prueba - Invitación MIPIM 2024',
        recipients: [
          {
            email: 'abalderas10@gmail.com',
            name: 'Alberto Balderas',
            magicLinkUrl: 'https://evento.com/registro/test123'
          }
        ],
        eventDate: '10 de septiembre, 2025',
        eventLocation: 'Ciudad de México',
        customMessage: 'Esperamos verte en este evento promocional exclusivo sobre MIPIM. ¡Será una experiencia increíble!'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Correo enviado exitosamente:');
      console.log('- Destinatario:', result.results?.[0]?.email || 'abalderas10@gmail.com');
      console.log('- Campaign ID:', result.campaignId || 'N/A');
      console.log('- Emails enviados:', result.emailsSent || 'N/A');
      console.log('- Message ID:', result.results?.[0]?.messageId || 'N/A');
      console.log('- Respuesta completa:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Error al enviar correo:');
      console.error('- Error:', result.error);
      console.error('- Detalles:', result.details);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

sendTestMipimEmail();