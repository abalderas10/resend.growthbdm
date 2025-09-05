// Script para configurar un nuevo API key de Resend
// Ejecuta este script después de obtener un nuevo API key válido

const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

function updateEnvFiles(newApiKey) {
  const envFiles = [
    '.env',
    '.env.local',
    'apps/web/.env'
  ];

  envFiles.forEach(envFile => {
    const envPath = path.join(__dirname, envFile);
    
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf8');
      
      // Actualizar RESEND_API_KEY
      if (content.includes('RESEND_API_KEY=')) {
        content = content.replace(/RESEND_API_KEY=.*/g, `RESEND_API_KEY=${newApiKey}`);
      } else {
        content += `\nRESEND_API_KEY=${newApiKey}\n`;
      }
      
      fs.writeFileSync(envPath, content);
      console.log(`✅ Actualizado: ${envFile}`);
    } else {
      console.log(`⚠️  No encontrado: ${envFile}`);
    }
  });
}

async function testNewApiKey(apiKey) {
  try {
    console.log('\n🔍 Probando nuevo API key...');
    
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('✅ API key válido!');
    
    // Verificar dominio aliest.growthbdm.com
    const aliestDomain = data.data?.find(d => d.name === 'aliest.growthbdm.com');
    if (aliestDomain) {
      console.log(`🎉 Dominio aliest.growthbdm.com encontrado - Estado: ${aliestDomain.status}`);
      return true;
    } else {
      console.log('⚠️  Dominio aliest.growthbdm.com no encontrado en Resend');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error al probar API key:', error.message);
    return false;
  }
}

async function sendTestEmail(apiKey) {
  try {
    console.log('\n📧 Enviando email de prueba...');
    
    const resend = new Resend(apiKey);
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@aliest.growthbdm.com',
      to: ['test@example.com'], // Cambia por tu email
      subject: 'Prueba de configuración MIPIM - aliest.growthbdm.com',
      html: `
        <h2>🎉 Configuración exitosa!</h2>
        <p>El dominio <strong>aliest.growthbdm.com</strong> está correctamente configurado con Resend.</p>
        <p>Los registros DNS han sido verificados y el API key es válido.</p>
        <hr>
        <p><small>Email enviado desde el sistema MIPIM Growth BDM</small></p>
      `
    });

    if (error) {
      console.error('❌ Error al enviar email:', error);
      return false;
    }

    console.log('✅ Email de prueba enviado exitosamente!');
    console.log('📧 ID del email:', data.id);
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Configuración de nuevo API key de Resend\n');
  
  // Obtener API key desde argumentos de línea de comandos
  const newApiKey = process.argv[2];
  
  if (!newApiKey) {
    console.log('❌ Por favor proporciona el nuevo API key como argumento:');
    console.log('   node setup-new-api-key.js re_tu_nuevo_api_key_aqui\n');
    console.log('📋 Pasos para obtener un nuevo API key:');
    console.log('1. Ve a https://resend.com/api-keys');
    console.log('2. Haz clic en "Create API Key"');
    console.log('3. Dale un nombre descriptivo (ej: "MIPIM-Production")');
    console.log('4. Selecciona los permisos necesarios');
    console.log('5. Copia el API key generado');
    console.log('6. Ejecuta: node setup-new-api-key.js [tu_api_key]\n');
    return;
  }
  
  if (!newApiKey.startsWith('re_')) {
    console.log('❌ El API key debe comenzar con "re_"');
    return;
  }
  
  // Probar el API key
  const isValid = await testNewApiKey(newApiKey);
  
  if (!isValid) {
    console.log('❌ El API key no es válido o el dominio no está configurado.');
    return;
  }
  
  // Actualizar archivos .env
  console.log('\n📝 Actualizando archivos de configuración...');
  updateEnvFiles(newApiKey);
  
  // Enviar email de prueba (opcional)
  console.log('\n¿Quieres enviar un email de prueba? (y/n)');
  // Para automatizar, comentamos esta parte por ahora
  // await sendTestEmail(newApiKey);
  
  console.log('\n🎉 ¡Configuración completada exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Reinicia tu servidor de desarrollo');
  console.log('2. Prueba el envío de emails MIPIM');
  console.log('3. Verifica que los emails lleguen correctamente\n');
}

// Ejecutar script principal
main().catch(console.error);