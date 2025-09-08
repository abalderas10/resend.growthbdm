const https = require('https');

// Configuración del correo
const emailData = {
  subject: "🏢 Invitación Exclusiva MIPIM 2026 - Cannes, Francia",
  recipients: [
    {
      email: "abalderas10@gmail.com",
      name: "Alberto Balderas",
      company: "ABDev",
      position: "Dev"
    }
  ],
  eventDate: "11-14 Marzo 2026",
  eventLocation: "Palais des Festivals, Cannes, Francia",
  customMessage: "Te invitamos a participar en el evento inmobiliario más importante del mundo. Esta es una oportunidad única para conectar con líderes globales del sector."
};

// Datos para la petición
const postData = JSON.stringify(emailData);

const options = {
  hostname: 'aliest.growthbdm.com',
  port: 443,
  path: '/api/send-mipim-invitations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_SECRET_KEY || 'your-secret-key'}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 Enviando invitación MIPIM a Alberto Balderas...');
console.log('📧 Email:', emailData.recipients[0].email);
console.log('👤 Nombre:', emailData.recipients[0].name);
console.log('🏢 Empresa:', emailData.recipients[0].company);
console.log('💼 Cargo:', emailData.recipients[0].position);
console.log('📅 Evento:', emailData.eventDate);
console.log('📍 Ubicación:', emailData.eventLocation);
console.log('\n' + '='.repeat(50));

const req = https.request(options, (res) => {
  console.log(`\n✅ Respuesta del servidor: ${res.statusCode}`);
  console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n📨 Respuesta completa:');
      console.log(JSON.stringify(response, null, 2));
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log('\n🎉 ¡Invitación enviada exitosamente!');
        console.log('📊 Emails enviados:', response.emailsSent || 1);
        console.log('🆔 Campaign ID:', response.campaignId || 'N/A');
        
        if (response.results && response.results.length > 0) {
          console.log('\n📋 Detalles del envío:');
          response.results.forEach((result, index) => {
            console.log(`  ${index + 1}. Email: ${result.email}`);
            console.log(`     Message ID: ${result.messageId}`);
            console.log(`     Estado: ${result.status}`);
          });
        }
      } else {
        console.log('\n❌ Error en el envío:');
        console.log('🔍 Detalles:', response.error || response.message || 'Error desconocido');
      }
    } catch (parseError) {
      console.log('\n📄 Respuesta raw (no JSON):');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n💥 Error en la petición:', error.message);
  console.error('🔧 Detalles técnicos:', error);
});

req.write(postData);
req.end();

console.log('⏳ Enviando petición...');