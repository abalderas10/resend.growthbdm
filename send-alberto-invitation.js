// Script para enviar invitación MIPIM a Alberto Balderas
require('dotenv').config();

const sendAlbertoInvitation = async () => {
  try {
    console.log('Enviando invitación MIPIM a Alberto Balderas...');
    
    // Generar magic link token
    const email = 'alberto.balderas@growthbdm.com';
    const eventId = 'mipim-2026-mexico';
    const timestamp = Date.now();
    const tokenData = `${email}:${eventId}:${timestamp}`;
    const magicLinkToken = Buffer.from(tokenData).toString('base64url');
    const magicLinkUrl = `http://localhost:3000/ticket/${magicLinkToken}`;
    
    const response = await fetch('http://localhost:3000/api/send-mipim-invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer mipim_secret_key_2025_growthbdm`
      },
      body: JSON.stringify({
        subject: 'Invitación Exclusiva - MIPIM 2026 México',
        recipients: [
          {
            email: 'alberto.balderas@growthbdm.com',
            name: 'Alberto Balderas',
            magicLinkUrl: magicLinkUrl
          }
        ],
        eventDate: '10 de septiembre, 2025',
        eventLocation: 'Neuchatel, Ciudad de México',
        customMessage: 'Como líder en el sector inmobiliario, tu participación en MIPIM 2026 México será fundamental. Este evento reunirá a los principales actores del mercado inmobiliario internacional. ¡Esperamos contar con tu presencia!'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Invitación enviada exitosamente:');
      console.log('- Destinatario:', result.results?.[0]?.email || 'alberto.balderas@growthbdm.com');
      console.log('- Nombre:', 'Alberto Balderas');
      console.log('- Magic Link:', magicLinkUrl);
      console.log('- Campaign ID:', result.campaignId || 'N/A');
      console.log('- Emails enviados:', result.emailsSent || 'N/A');
      console.log('- Message ID:', result.results?.[0]?.messageId || 'N/A');
      console.log('\n📧 Detalles del correo:');
      console.log('- Asunto:', 'Invitación Exclusiva - MIPIM 2026 México');
      console.log('- Evento:', 'MIPIM 2026 México');
      console.log('- Fecha:', '10 de septiembre, 2025');
      console.log('- Ubicación:', 'Neuchatel, Ciudad de México');
      console.log('\n🔗 Para confirmar asistencia, Alberto debe hacer clic en el botón del correo');
      console.log('   que lo llevará a:', magicLinkUrl);
    } else {
      console.error('❌ Error al enviar invitación:');
      console.error('- Error:', result.error);
      console.error('- Detalles:', result.details);
      console.error('- Respuesta completa:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('- Stack:', error.stack);
  }
};

sendAlbertoInvitation();