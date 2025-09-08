// Script para enviar correo real a Alberto Balderas
const http = require('http');

const sendEmail = async () => {
  const data = JSON.stringify({
    subject: 'Invitación Exclusiva - MIPIM 2026 México',
    recipients: [{
      email: 'abalderas10@gmail.com',
      name: 'Alberto Balderas',
      company: 'ABDev',
      position: 'DEv',
      magicLinkUrl: 'https://aliest.growthbdm.com/ticket/YWxiZXJ0by5iYWxkZXJhc0Bncm93dGhiZG0uY29tOm1pcGltLTIwMjYtbWV4aWNvOjE3NTcxMjU2MDA'
    }],
    eventDate: '10 de septiembre, 2025',
    eventLocation: 'Neuchatel, Ciudad de México',
    customMessage: 'Como líder en el sector inmobiliario, tu participación en MIPIM 2026 México será fundamental. Este evento reunirá a los principales actores del mercado inmobiliario internacional. ¡Esperamos contar con tu presencia!'
  });

  const options = {
  hostname: 'localhost',
  port: 3000,
    path: '/api/send-mipim-invitations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mipim_secret_key_2025_growthbdm',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Headers:', res.headers);
        console.log('Response Body:', responseData);
        
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(responseData);
            console.log('\n✅ Invitación enviada exitosamente:');
            console.log('- Destinatario: alberto.balderas@growthbdm.com');
            console.log('- Nombre: Alberto Balderas');
            console.log('- Empresa: ABDev');
            console.log('- Cargo: DEv');
            console.log('- Campaign ID:', result.campaignId || 'N/A');
            console.log('- Emails enviados:', result.emailsSent || 'N/A');
            console.log('- Message ID:', result.results?.[0]?.messageId || 'N/A');
            console.log('\n📧 El correo ha sido enviado con éxito!');
            resolve(result);
          } catch (e) {
            console.log('✅ Respuesta exitosa (no JSON):', responseData);
            resolve(responseData);
          }
        } else {
          console.log('❌ Error en la respuesta:', responseData);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Error de conexión:', error.message);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
};

console.log('🚀 Iniciando envío de invitación MIPIM a Alberto Balderas...');
sendEmail()
  .then(() => {
    console.log('\n🎉 Proceso completado exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error en el proceso:', error.message);
    process.exit(1);
  });