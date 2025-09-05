// Guía interactiva para generar un nuevo API key de Resend
// Este script te ayudará paso a paso

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testApiKey(apiKey) {
  try {
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const aliestDomain = data.data?.find(d => d.name === 'aliest.growthbdm.com');
      return {
        valid: true,
        domains: data.data || [],
        hasAliestDomain: !!aliestDomain,
        aliestStatus: aliestDomain?.status
      };
    } else {
      const errorData = await response.json();
      return {
        valid: false,
        error: errorData.message || 'API key inválida'
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

function updateEnvFiles(newApiKey) {
  const envFiles = [
    { path: '.env', name: '.env' },
    { path: '.env.local', name: '.env.local' },
    { path: 'apps/web/.env', name: 'apps/web/.env' }
  ];

  const results = [];

  envFiles.forEach(envFile => {
    const fullPath = path.join(__dirname, envFile.path);
    
    if (fs.existsSync(fullPath)) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        if (content.includes('RESEND_API_KEY=')) {
          content = content.replace(/RESEND_API_KEY=.*/g, `RESEND_API_KEY=${newApiKey}`);
        } else {
          content += `\nRESEND_API_KEY=${newApiKey}\n`;
        }
        
        fs.writeFileSync(fullPath, content);
        results.push({ file: envFile.name, status: 'actualizado' });
      } catch (error) {
        results.push({ file: envFile.name, status: 'error', error: error.message });
      }
    } else {
      results.push({ file: envFile.name, status: 'no encontrado' });
    }
  });

  return results;
}

async function main() {
  console.log('🔑 Generador de nuevo API key para Resend\n');
  console.log('Este script te ayudará a configurar un nuevo API key válido.\n');
  
  console.log('📋 Pasos para obtener un nuevo API key:');
  console.log('1. Ve a https://resend.com/api-keys');
  console.log('2. Inicia sesión en tu cuenta de Resend');
  console.log('3. Haz clic en "Create API Key"');
  console.log('4. Configura el API key:');
  console.log('   - Nombre: "MIPIM-Production" (o el que prefieras)');
  console.log('   - Permisos: "Full access" o "Sending access"');
  console.log('   - Dominio: Selecciona "aliest.growthbdm.com" si aparece');
  console.log('5. Copia el API key generado (empieza con "re_")\n');
  
  const shouldContinue = await question('¿Ya tienes el nuevo API key? (s/n): ');
  
  if (shouldContinue.toLowerCase() !== 's') {
    console.log('\n👋 Perfecto. Cuando tengas el API key, ejecuta este script nuevamente.');
    rl.close();
    return;
  }
  
  const newApiKey = await question('\n🔑 Pega tu nuevo API key aquí: ');
  
  if (!newApiKey || !newApiKey.startsWith('re_')) {
    console.log('❌ El API key debe empezar con "re_". Inténtalo de nuevo.');
    rl.close();
    return;
  }
  
  console.log('\n🔍 Probando el nuevo API key...');
  
  const testResult = await testApiKey(newApiKey);
  
  if (!testResult.valid) {
    console.log(`❌ El API key no es válido: ${testResult.error}`);
    console.log('\n💡 Verifica que:');
    console.log('- El API key esté copiado correctamente');
    console.log('- Tengas permisos suficientes en tu cuenta de Resend');
    console.log('- El API key no haya expirado');
    rl.close();
    return;
  }
  
  console.log('✅ ¡API key válido!');
  console.log(`📋 Dominios encontrados: ${testResult.domains.length}`);
  
  if (testResult.domains.length > 0) {
    console.log('\n🌐 Dominios configurados:');
    testResult.domains.forEach((domain, index) => {
      const isAliest = domain.name === 'aliest.growthbdm.com';
      const marker = isAliest ? '🎯' : '  ';
      console.log(`${marker} ${index + 1}. ${domain.name} (${domain.status})`);
    });
  }
  
  if (testResult.hasAliestDomain) {
    console.log(`\n🎉 ¡Perfecto! El dominio aliest.growthbdm.com está configurado (${testResult.aliestStatus})`);
  } else {
    console.log('\n⚠️  El dominio aliest.growthbdm.com no aparece en la lista.');
    console.log('Asegúrate de que esté añadido en el dashboard de Resend.');
  }
  
  const shouldUpdate = await question('\n💾 ¿Quieres actualizar los archivos .env con este API key? (s/n): ');
  
  if (shouldUpdate.toLowerCase() === 's') {
    console.log('\n📝 Actualizando archivos de configuración...');
    const updateResults = updateEnvFiles(newApiKey);
    
    updateResults.forEach(result => {
      if (result.status === 'actualizado') {
        console.log(`✅ ${result.file}: actualizado`);
      } else if (result.status === 'no encontrado') {
        console.log(`⚠️  ${result.file}: no encontrado`);
      } else {
        console.log(`❌ ${result.file}: error - ${result.error}`);
      }
    });
    
    console.log('\n🎉 ¡Configuración completada!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Reinicia tu servidor de desarrollo si está corriendo');
    console.log('2. Prueba el envío de emails MIPIM');
    console.log('3. Verifica que los emails lleguen correctamente');
    
    if (testResult.hasAliestDomain && testResult.aliestStatus === 'verified') {
      console.log('\n🚀 ¡Todo listo! Puedes empezar a enviar emails desde noreply@aliest.growthbdm.com');
    }
  } else {
    console.log('\n📝 Para actualizar manualmente, reemplaza RESEND_API_KEY en:');
    console.log('- .env');
    console.log('- .env.local');
    console.log('- apps/web/.env');
    console.log(`\nNuevo valor: RESEND_API_KEY=${newApiKey}`);
  }
  
  rl.close();
}

// Ejecutar el script principal
main().catch(error => {
  console.error('❌ Error:', error.message);
  rl.close();
});