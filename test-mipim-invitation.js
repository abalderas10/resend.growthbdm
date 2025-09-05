/**
 * Script de prueba para las invitaciones MIPIM
 * 
 * Este script permite probar rápidamente el envío de invitaciones MIPIM
 * sin necesidad de configurar TypeScript.
 */

const https = require('https');
const http = require('http');

// Configuración
const API_BASE_URL = 'http://localhost:3000';
const API_SECRET_KEY = process.env.API_SECRET_KEY;

// Función para generar magic link simple
function generateMagicLink(baseUrl, email, eventId = 'mipim2026') {
  const token = Buffer.from(`${email}:${eventId}:${Date.now()}`).toString('base64url');
  return `${baseUrl}/ticket/${token}`;
}

// Función para hacer peticiones HTTP
function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    
    const req = lib.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Función principal de prueba
async function testMipimInvitation() {
  try {
    console.log('🧪 Iniciando prueba de invitación MIPIM...');
    
    // Verificar configuración
    if (!API_SECRET_KEY) {
      console.error('❌ Error: API_SECRET_KEY no está configurada');
      console.log('   Configura la variable de entorno: set API_SECRET_KEY=tu_clave_secreta');
      return;
    }

    // Datos de prueba
    const testEmail = 'abalderas10@gmail.com';
    const testName = 'Alejandro Balderas';
    
    const recipient = {
      email: testEmail,
      firstName: testName,
      magicLinkUrl: generateMagicLink('https://mipim.aliest.growthbdm.com', testEmail)
    };

    const payload = {
      subject: '🎯 Invitación Exclusiva MIPIM 2025 - Confirma tu Asistencia',
      recipients: [recipient],
      eventDate: '10 de Septiembre, 2025',
      eventLocation: 'Neuchatel, Ciudad de México',
      customMessage: 'Esta es una invitación de prueba para verificar la integración MIPIM.',
      options: {
        batchSize: 1,
        delayBetweenBatches: 0
      }
    };

    console.log(`📧 Enviando invitación de prueba a: ${testEmail}`);
    console.log(`🔗 Magic Link: ${recipient.magicLinkUrl}`);
    
    // Realizar petición
    const response = await makeRequest(
      `${API_BASE_URL}/api/send-mipim-invitations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_SECRET_KEY}`
        }
      },
      payload
    );

    console.log(`📊 Respuesta del servidor (${response.statusCode}):`);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ ¡Prueba exitosa!');
      console.log(`   - Invitaciones enviadas: ${response.data.data.totalSent}`);
      console.log(`   - Invitaciones fallidas: ${response.data.data.totalFailed}`);
      console.log(`   - Duración: ${response.data.data.duration}ms`);
      console.log(`   - ID de campaña: ${response.data.data.campaignId}`);
    } else {
      console.log('❌ Error en la prueba:');
      console.log('   Respuesta:', JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  }
}

// Función para probar el endpoint general con tipo MIPIM
async function testGeneralEndpoint() {
  try {
    console.log('🧪 Probando endpoint general con tipo MIPIM...');
    
    if (!API_SECRET_KEY) {
      console.error('❌ Error: API_SECRET_KEY no está configurada');
      return;
    }

    const testEmail = 'test-general@ejemplo.com';
    const magicLink = generateMagicLink('https://mipim.aliest.growthbdm.com', testEmail);
    
    const payload = {
      campaignType: 'mipim',
      subject: 'Invitación MIPIM - Prueba General',
      recipients: [{
        email: testEmail,
        firstName: 'Usuario',
        lastName: 'Prueba General'
      }],
      templateData: {
        magicLinkUrl: magicLink,
        eventDate: '10 de Septiembre, 2025',
        eventLocation: 'Neuchatel, Ciudad de México',
        customMessage: 'Prueba usando el endpoint general con tipo MIPIM'
      },
      options: {
        batchSize: 1,
        delayBetweenBatches: 0
      }
    };

    console.log(`📧 Enviando a: ${testEmail}`);
    
    const response = await makeRequest(
      `${API_BASE_URL}/api/send-campaign`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_SECRET_KEY}`
        }
      },
      payload
    );

    console.log(`📊 Respuesta del endpoint general (${response.statusCode}):`);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ ¡Prueba del endpoint general exitosa!');
      console.log(`   - Emails enviados: ${response.data.data.totalSent}`);
      console.log(`   - ID de campaña: ${response.data.data.campaignId}`);
    } else {
      console.log('❌ Error en endpoint general:');
      console.log('   Respuesta:', JSON.stringify(response.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error en prueba general:', error.message);
  }
}

// Ejecutar pruebas
if (require.main === module) {
  const args = process.argv.slice(2);
  
  console.log('🏢 MIPIM Invitation Test Suite');
  console.log('================================\n');
  
  if (args[0] === 'general') {
    testGeneralEndpoint();
  } else if (args[0] === 'both') {
    testMipimInvitation().then(() => {
      console.log('\n' + '='.repeat(50) + '\n');
      return testGeneralEndpoint();
    });
  } else {
    testMipimInvitation();
  }
}

module.exports = {
  testMipimInvitation,
  testGeneralEndpoint,
  generateMagicLink
};