/**
 * Prueba Final y Corregida de API Keys de Resend
 * 
 * Este script usa la estructura correcta de respuesta de Resend API
 * para determinar qué API keys son válidas.
 */

const { Resend } = require('resend');
const fs = require('fs');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log('cyan', `🔑 ${title}`);
  console.log('='.repeat(60));
}

async function testApiKeyCorrect(apiKey, source) {
  log('blue', `\n🧪 Probando API Key: ${source}`);
  log('white', `   Clave: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}`);
  log('white', `   Longitud: ${apiKey.length} caracteres`);
  log('white', `   Formato: ${apiKey.startsWith('re_') ? '✅ Válido' : '❌ Inválido'}`);
  
  const result = {
    source,
    apiKey: apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 4),
    fullKey: apiKey,
    length: apiKey.length,
    validFormat: apiKey.startsWith('re_'),
    isValid: false,
    domains: [],
    hasTargetDomain: false,
    error: null,
    responseTime: null
  };
  
  try {
    const resend = new Resend(apiKey);
    
    log('white', '   📡 Probando conexión...');
    const startTime = Date.now();
    const response = await resend.domains.list();
    const endTime = Date.now();
    
    result.responseTime = endTime - startTime;
    
    // Usar la estructura correcta: response.data.data
    if (response && response.data && Array.isArray(response.data.data)) {
      result.isValid = true;
      result.domains = response.data.data.map(domain => ({
        id: domain.id,
        name: domain.name,
        status: domain.status,
        region: domain.region,
        created_at: domain.created_at
      }));
      
      result.hasTargetDomain = result.domains.some(d => d.name === 'aliest.growthbdm.com');
      
      log('green', `   ✅ API Key VÁLIDA! (${result.responseTime}ms)`);
      log('white', `   📊 Dominios encontrados: ${result.domains.length}`);
      
      result.domains.forEach(domain => {
        const statusIcon = domain.status === 'verified' ? '✅' : 
                          domain.status === 'pending' ? '⏳' : '❌';
        log('white', `      ${statusIcon} ${domain.name} (${domain.status})`);
        
        if (domain.name === 'aliest.growthbdm.com') {
          log('green', '        🎯 ¡DOMINIO OBJETIVO ENCONTRADO Y VERIFICADO!');
        }
      });
      
    } else {
      result.error = 'Estructura de respuesta inesperada';
      log('red', '   ❌ Estructura de respuesta inesperada');
      log('white', `   Debug: ${JSON.stringify(response, null, 2)}`);
    }
    
  } catch (error) {
    result.error = error.message;
    log('red', `   ❌ Error: ${error.message}`);
    
    if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
      log('red', '   🚫 API Key inválida o revocada');
    } else if (error.message.includes('rate limit')) {
      log('yellow', '   ⏱️  Límite de velocidad alcanzado');
    } else {
      log('red', '   ❓ Error desconocido');
    }
  }
  
  return result;
}

async function finalApiKeyTest() {
  section('PRUEBA FINAL DE API KEYS CON ESTRUCTURA CORREGIDA');
  
  // API Keys encontradas en el análisis
  const apiKeysToTest = [
    {
      key: 're_dasBV1Zg_AMiUPvNEbckHW61U3hJYK8ZX',
      source: '.env.local y apps/web/.env'
    },
    {
      key: 're_new_api_key_from_env_local',
      source: '.env (raíz)'
    },
    {
      key: 're_5qZePDtW_K4oimtTzkwMW6sMPvLoXYyUC',
      source: 'vercel.json'
    }
  ];
  
  const results = [];
  
  for (const apiKeyInfo of apiKeysToTest) {
    const result = await testApiKeyCorrect(apiKeyInfo.key, apiKeyInfo.source);
    results.push(result);
    
    // Pausa entre pruebas para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Análisis de resultados
  section('ANÁLISIS DE RESULTADOS');
  
  const validKeys = results.filter(r => r.isValid);
  const invalidKeys = results.filter(r => !r.isValid);
  const keysWithTargetDomain = validKeys.filter(r => r.hasTargetDomain);
  
  log('white', `📊 Resumen de pruebas:`);
  log('white', `   Total probadas: ${results.length}`);
  log('green', `   ✅ Válidas: ${validKeys.length}`);
  log('red', `   ❌ Inválidas: ${invalidKeys.length}`);
  log('cyan', `   🎯 Con dominio objetivo: ${keysWithTargetDomain.length}`);
  
  if (validKeys.length > 0) {
    section('🎉 API KEYS VÁLIDAS ENCONTRADAS');
    
    validKeys.forEach((result, index) => {
      log('green', `\n${index + 1}. ${result.source}`);
      log('white', `   Clave: ${result.apiKey}`);
      log('white', `   Tiempo de respuesta: ${result.responseTime}ms`);
      log('white', `   Dominios: ${result.domains.length}`);
      log('white', `   Dominio objetivo: ${result.hasTargetDomain ? '✅ SÍ' : '❌ NO'}`);
      
      if (result.domains.length > 0) {
        log('white', '   Lista de dominios:');
        result.domains.forEach(domain => {
          const statusIcon = domain.status === 'verified' ? '✅' : 
                            domain.status === 'pending' ? '⏳' : '❌';
          log('white', `     ${statusIcon} ${domain.name} (${domain.status})`);
        });
      }
    });
    
    // Determinar la mejor API key
    const bestKey = keysWithTargetDomain.length > 0 ? keysWithTargetDomain[0] : validKeys[0];
    
    section('🏆 RECOMENDACIÓN FINAL');
    log('cyan', `🎯 API KEY RECOMENDADA: ${bestKey.source}`);
    log('white', `   Clave: ${bestKey.apiKey}`);
    log('white', `   Razón: ${bestKey.hasTargetDomain ? 
      'Tiene acceso al dominio aliest.growthbdm.com verificado' : 
      'Es la única API key válida encontrada'}`);
    
    if (bestKey.hasTargetDomain) {
      log('green', '\n✅ CONFIGURACIÓN LISTA PARA USAR');
      log('white', '   El dominio aliest.growthbdm.com está verificado y accesible');
      log('white', '   Puedes proceder con el envío de emails');
    } else {
      log('yellow', '\n⚠️  ACCIÓN REQUERIDA');
      log('white', '   Aunque la API key es válida, necesitas:');
      log('white', '   1. Verificar el dominio aliest.growthbdm.com en Resend');
      log('white', '   2. Configurar los registros DNS correctamente');
    }
    
    // Instrucciones de actualización
    section('📝 INSTRUCCIONES DE ACTUALIZACIÓN');
    log('white', `Para usar la API key recomendada (${bestKey.source}):`);
    log('white', '');
    log('white', '1. Actualizar archivos .env:');
    
    const filesToUpdate = [
      '.env.local',
      'apps/web/.env.local',
      'apps/web/.env',
      '.env'
    ];
    
    filesToUpdate.forEach(file => {
      log('white', `   echo "RESEND_API_KEY=${bestKey.fullKey}" >> ${file}`);
    });
    
    log('white', '');
    log('white', '2. Actualizar vercel.json si es necesario');
    log('white', '3. Reiniciar el servidor de desarrollo');
    log('white', '4. Probar el envío de emails');
    
  } else {
    section('🚨 NO SE ENCONTRARON API KEYS VÁLIDAS');
    log('red', 'Todas las API keys probadas son inválidas o han sido revocadas.');
    
    log('yellow', '\n💡 ACCIONES REQUERIDAS:');
    log('white', '1. Ir a https://resend.com/api-keys');
    log('white', '2. Generar una nueva API Key con permisos completos');
    log('white', '3. Asegurarse de que el dominio aliest.growthbdm.com esté verificado');
    log('white', '4. Actualizar todos los archivos de configuración');
    log('white', '5. Usar el script generate-new-api-key-guide.js para configurar');
  }
  
  if (invalidKeys.length > 0) {
    section('❌ API KEYS INVÁLIDAS');
    invalidKeys.forEach((result, index) => {
      log('red', `${index + 1}. ${result.source}`);
      log('white', `   Clave: ${result.apiKey}`);
      log('white', `   Error: ${result.error}`);
    });
  }
  
  // Guardar reporte final
  const finalReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTested: results.length,
      validKeys: validKeys.length,
      invalidKeys: invalidKeys.length,
      keysWithTargetDomain: keysWithTargetDomain.length,
      recommendedKey: validKeys.length > 0 ? (keysWithTargetDomain[0] || validKeys[0]) : null
    },
    results: results,
    conclusion: validKeys.length > 0 ? 
      (keysWithTargetDomain.length > 0 ? 'READY_TO_USE' : 'DOMAIN_SETUP_NEEDED') : 
      'NEW_API_KEY_REQUIRED'
  };
  
  const reportPath = 'final-api-key-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
  log('green', `\n💾 Reporte final guardado en: ${reportPath}`);
  
  section('PRUEBA COMPLETADA');
  
  return finalReport;
}

// Ejecutar prueba final
if (require.main === module) {
  finalApiKeyTest().catch(error => {
    console.error('❌ Error durante la prueba final:', error);
    process.exit(1);
  });
}

module.exports = { finalApiKeyTest, testApiKeyCorrect };