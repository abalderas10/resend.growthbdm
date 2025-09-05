const { Resend } = require('resend');
require('dotenv').config();

// Configuración
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@growthbdm.com';
const TEST_EMAIL = 'abalderas10@gmail.com';

async function verifyResendConfiguration() {
  console.log('🔍 Verificando configuración de Resend...');
  console.log('=' .repeat(50));
  
  // 1. Verificar API Key
  console.log('\n1. Verificando API Key...');
  if (!RESEND_API_KEY) {
    console.log('❌ ERROR: RESEND_API_KEY no está configurada');
    return;
  }
  
  console.log(`📋 API Key length: ${RESEND_API_KEY.length}`);
  console.log(`📋 API Key preview: ${RESEND_API_KEY.substring(0, 15)}...`);
  
  if (RESEND_API_KEY === 'your_resend_api_key') {
    console.log('❌ ERROR: RESEND_API_KEY contiene valor de ejemplo');
    return;
  }
  
  console.log(`✅ API Key encontrada y parece válida`);
  
  // 2. Inicializar Resend
  console.log('\n2. Inicializando cliente Resend...');
  const resend = new Resend(RESEND_API_KEY);
  
  try {
    // 3. Verificar dominios
    console.log('\n3. Verificando dominios configurados...');
    const domains = await resend.domains.list();
    console.log('📋 Dominios encontrados:');
    
    if (domains.data && domains.data.length > 0) {
      domains.data.forEach(domain => {
        console.log(`   - ${domain.name} (${domain.status})`);
        if (domain.status === 'verified') {
          console.log(`     ✅ Verificado`);
        } else {
          console.log(`     ⚠️  Estado: ${domain.status}`);
        }
      });
    } else {
      console.log('   ❌ No se encontraron dominios configurados');
    }
    
    // 4. Verificar dominio FROM_EMAIL
    console.log(`\n4. Verificando dominio del FROM_EMAIL: ${FROM_EMAIL}`);
    const fromDomain = FROM_EMAIL.split('@')[1];
    const domainFound = domains.data?.find(d => d.name === fromDomain);
    
    if (domainFound) {
      if (domainFound.status === 'verified') {
        console.log(`✅ Dominio ${fromDomain} está verificado`);
      } else {
        console.log(`❌ Dominio ${fromDomain} NO está verificado (${domainFound.status})`);
      }
    } else {
      console.log(`❌ Dominio ${fromDomain} NO está configurado en Resend`);
    }
    
    // 5. Probar envío de email de prueba
    console.log('\n5. Probando envío de email de prueba...');
    const testResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TEST_EMAIL],
      subject: '🔧 Test de Configuración Resend - MIPIM',
      html: `
        <h2>Test de Configuración Resend</h2>
        <p>Este es un email de prueba para verificar la configuración de Resend.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>FROM_EMAIL:</strong> ${FROM_EMAIL}</p>
        <p><strong>API Key:</strong> ${RESEND_API_KEY.substring(0, 10)}...</p>
        <hr>
        <p><em>Si recibes este email, la configuración de Resend está funcionando correctamente.</em></p>
      `
    });
    
    if (testResult.data) {
      console.log(`✅ Email de prueba enviado exitosamente`);
      console.log(`   📧 ID del mensaje: ${testResult.data.id}`);
      console.log(`   📬 Destinatario: ${TEST_EMAIL}`);
    } else {
      console.log(`❌ Error al enviar email de prueba:`, testResult.error);
    }
    
  } catch (error) {
    console.log('❌ Error al verificar configuración:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 Solución: Verifica que la API key de Resend sea correcta');
    } else if (error.message.includes('Domain not found')) {
      console.log('\n💡 Solución: Configura y verifica el dominio en Resend Dashboard');
    } else if (error.message.includes('Unauthorized')) {
      console.log('\n💡 Solución: La API key no tiene permisos suficientes');
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 Verificación completada');
}

// Ejecutar verificación
verifyResendConfiguration().catch(console.error);