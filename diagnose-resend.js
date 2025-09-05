const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.RESEND_API_KEY;

async function diagnoseResend() {
  console.log('🔍 Diagnóstico completo de Resend\n');
  
  // 1. Verificar API key
  console.log('1. Verificando API key:');
  console.log(`   Formato: ${API_KEY ? (API_KEY.startsWith('re_') ? '✅ Correcto (re_...)' : '❌ Incorrecto (debe empezar con re_)') : '❌ No encontrada'}`);
  console.log(`   Longitud: ${API_KEY ? API_KEY.length : 0} caracteres`);
  console.log(`   Valor: ${API_KEY ? API_KEY.substring(0, 15) + '...' : 'No definida'}\n`);
  
  if (!API_KEY || !API_KEY.startsWith('re_')) {
    console.log('❌ API key inválida. Debe empezar con "re_"');
    return;
  }
  
  // 2. Probar conexión básica
  console.log('2. Probando conexión básica con Resend:');
  try {
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'MIPIM-Diagnostic/1.0'
      }
    });
    
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    
    if (response.status === 401) {
      console.log('\n❌ Error 401: API key no autorizada');
      console.log('   Posibles causas:');
      console.log('   - API key revocada o expirada');
      console.log('   - API key de un entorno diferente (test vs production)');
      console.log('   - Permisos insuficientes en el API key');
      
      const errorBody = await response.text();
      console.log(`   Respuesta del servidor: ${errorBody}`);
      return;
    }
    
    if (response.status === 400) {
      const errorData = await response.json();
      console.log('\n❌ Error 400: Solicitud inválida');
      console.log(`   Mensaje: ${errorData.message}`);
      console.log(`   Tipo: ${errorData.name}`);
      return;
    }
    
    if (!response.ok) {
      console.log(`\n❌ Error ${response.status}: ${response.statusText}`);
      const errorBody = await response.text();
      console.log(`   Respuesta: ${errorBody}`);
      return;
    }
    
    const data = await response.json();
    console.log('   ✅ Conexión exitosa\n');
    
    // 3. Listar dominios
    console.log('3. Dominios configurados en Resend:');
    if (data.data && data.data.length > 0) {
      data.data.forEach((domain, index) => {
        console.log(`\n   ${index + 1}. ${domain.name}`);
        console.log(`      Estado: ${domain.status}`);
        console.log(`      ID: ${domain.id}`);
        console.log(`      Región: ${domain.region}`);
        console.log(`      Creado: ${new Date(domain.created_at).toLocaleString()}`);
      });
      
      // 4. Verificar dominio específico
      console.log('\n4. Verificando dominio aliest.growthbdm.com:');
      const aliestDomain = data.data.find(d => d.name === 'aliest.growthbdm.com');
      
      if (aliestDomain) {
        console.log('   ✅ Dominio encontrado');
        console.log(`   Estado: ${aliestDomain.status}`);
        console.log(`   ID: ${aliestDomain.id}`);
        
        if (aliestDomain.status === 'verified') {
          console.log('   🎉 Dominio completamente verificado y listo para usar');
          
          // 5. Probar envío de email
          await testEmailSending();
        } else {
          console.log(`   ⚠️  Dominio no verificado. Estado actual: ${aliestDomain.status}`);
        }
      } else {
        console.log('   ❌ Dominio aliest.growthbdm.com NO encontrado');
        console.log('   Dominios disponibles:');
        data.data.forEach(d => console.log(`   - ${d.name} (${d.status})`));
      }
    } else {
      console.log('   ❌ No hay dominios configurados');
    }
    
  } catch (error) {
    console.log(`\n❌ Error de conexión: ${error.message}`);
    console.log('   Posibles causas:');
    console.log('   - Problema de red');
    console.log('   - Firewall bloqueando la conexión');
    console.log('   - Servidor de Resend no disponible');
  }
}

async function testEmailSending() {
  console.log('\n5. Probando envío de email de prueba:');
  
  try {
    const resend = new Resend(API_KEY);
    
    const testEmail = {
      from: 'noreply@aliest.growthbdm.com',
      to: ['test@resend.dev'], // Email de prueba de Resend
      subject: 'Prueba de configuración - MIPIM Growth BDM',
      html: `
        <h2>🎉 Prueba exitosa</h2>
        <p>El dominio <strong>aliest.growthbdm.com</strong> está funcionando correctamente.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    };
    
    console.log('   Enviando email de prueba...');
    console.log(`   De: ${testEmail.from}`);
    console.log(`   Para: ${testEmail.to.join(', ')}`);
    
    const { data, error } = await resend.emails.send(testEmail);
    
    if (error) {
      console.log('   ❌ Error al enviar:');
      console.log(`   Código: ${error.name}`);
      console.log(`   Mensaje: ${error.message}`);
      
      if (error.name === 'validation_error' && error.message.includes('domain')) {
        console.log('\n   💡 Sugerencia: Verifica que el dominio esté correctamente configurado en Resend');
      }
    } else {
      console.log('   ✅ Email enviado exitosamente!');
      console.log(`   ID del email: ${data.id}`);
      console.log('   🎉 ¡La configuración está funcionando perfectamente!');
    }
    
  } catch (error) {
    console.log(`   ❌ Error inesperado: ${error.message}`);
  }
}

// Ejecutar diagnóstico
console.log('🚀 Iniciando diagnóstico de Resend...\n');
diagnoseResend().catch(console.error);