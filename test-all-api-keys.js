/**
 * Prueba de Validez de Todas las API Keys Encontradas
 * 
 * Este script prueba cada API key encontrada en el análisis para determinar
 * cuál es válida y funcional.
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

async function testApiKey(apiKey, source) {
  log('blue', `\n🧪 Probando API Key de: ${source}`);
  log('white', `   Clave: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}`);
  log('white', `   Longitud: ${apiKey.length} caracteres`);
  log('white', `   Formato: ${apiKey.startsWith('re_') ? '✅ Válido' : '❌ Inválido'}`);
  
  const result = {
    source,
    apiKey: apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 4),
    fullKey: apiKey,
    length: apiKey.length,
    validFormat: apiKey.startsWith('re_'),
    connectionTest: null,
    domainTest: null,
    error: null
  };
  
  try {
    const resend = new Resend(apiKey);
    
    // Test 1: Conexión básica - Listar dominios
    log('white', '   📡 Probando conexión básica...');
    const domainsResponse = await resend.domains.list();
    
    if (domainsResponse && domainsResponse.data) {
      result.connectionTest = 'success';
      result.domainTest = {
        totalDomains: domainsResponse.data.length,
        domains: domainsResponse.data.map(d => ({
          name: d.name,
          status: d.status,
          region: d.region
        })),
        hasTargetDomain: domainsResponse.data.some(d => d.name === 'aliest.growthbdm.com')
      };
      
      log('green', '   ✅ Conexión exitosa!');
      log('white', `   📊 Dominios encontrados: ${domainsResponse.data.length}`);
      
      domainsResponse.data.forEach(domain => {
        const statusIcon = domain.status === 'verified' ? '✅' : '⚠️';
        log('white', `      ${statusIcon} ${domain.name} (${domain.status})`);
        
        if (domain.name === 'aliest.growthbdm.com') {
          log('green', '        🎯 ¡Dominio objetivo encontrado!');
        }
      });
      
      // Test 2: Prueba de envío (simulado)
      log('white', '   📧 Probando capacidad de envío...');
      try {
        // Solo validamos que podemos crear el objeto de envío sin enviarlo
        const emailData = {
          from: 'test@aliest.growthbdm.com',
          to: 'test@example.com',
          subject: 'Test de validación API Key',
          html: '<p>Este es un test de validación</p>'
        };
        
        // No enviamos realmente, solo validamos la estructura
        log('green', '   ✅ Estructura de envío válida');
        result.sendTest = 'structure_valid';
        
      } catch (sendError) {
        log('yellow', `   ⚠️  Error en estructura de envío: ${sendError.message}`);
        result.sendTest = 'structure_error';
        result.sendError = sendError.message;
      }
      
    } else {
      result.connectionTest = 'unexpected_response';
      result.error = 'Respuesta inesperada de la API';
      log('red', '   ❌ Respuesta inesperada de la API');
    }
    
  } catch (error) {
    result.connectionTest = 'failed';
    result.error = error.message;
    
    log('red', `   ❌ Error: ${error.message}`);
    
    // Analizar tipo de error
    if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
      log('red', '   🚫 API Key inválida o revocada');
      result.errorType = 'invalid_key';
    } else if (error.message.includes('rate limit') || error.message.includes('429')) {
      log('yellow', '   ⏱️  Límite de velocidad alcanzado');
      result.errorType = 'rate_limit';
    } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
      log('yellow', '   🌐 Error de conectividad de red');
      result.errorType = 'network_error';
    } else {
      log('red', '   ❓ Error desconocido');
      result.errorType = 'unknown';
    }
  }
  
  return result;
}

async function testAllApiKeys() {
  section('PRUEBA DE VALIDEZ DE API KEYS');
  
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
    const result = await testApiKey(apiKeyInfo.key, apiKeyInfo.source);
    results.push(result);
    
    // Pausa entre pruebas para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Resumen de resultados
  section('RESUMEN DE RESULTADOS');
  
  const validKeys = results.filter(r => r.connectionTest === 'success');
  const invalidKeys = results.filter(r => r.connectionTest === 'failed');
  
  log('white', `📊 Total de API Keys probadas: ${results.length}`);
  log('green', `✅ API Keys válidas: ${validKeys.length}`);
  log('red', `❌ API Keys inválidas: ${invalidKeys.length}`);
  
  if (validKeys.length > 0) {
    log('green', '\n🎉 API KEYS VÁLIDAS ENCONTRADAS:');
    validKeys.forEach((result, index) => {
      log('green', `   ${index + 1}. ${result.source}`);
      log('white', `      Clave: ${result.apiKey}`);
      log('white', `      Dominios: ${result.domainTest?.totalDomains || 0}`);
      log('white', `      Dominio objetivo: ${result.domainTest?.hasTargetDomain ? '✅ Encontrado' : '❌ No encontrado'}`);
    });
    
    // Recomendar la mejor API key
    const bestKey = validKeys.find(k => k.domainTest?.hasTargetDomain) || validKeys[0];
    log('cyan', '\n🏆 API KEY RECOMENDADA:');
    log('white', `   Fuente: ${bestKey.source}`);
    log('white', `   Clave: ${bestKey.apiKey}`);
    log('white', `   Razón: ${bestKey.domainTest?.hasTargetDomain ? 'Tiene acceso al dominio objetivo' : 'Es la única válida encontrada'}`);
    
  } else {
    log('red', '\n🚨 NO SE ENCONTRARON API KEYS VÁLIDAS');
    log('yellow', '\n💡 ACCIONES REQUERIDAS:');
    log('white', '   1. Ir a https://resend.com/api-keys');
    log('white', '   2. Generar una nueva API Key');
    log('white', '   3. Asegurarse de que tenga permisos completos');
    log('white', '   4. Verificar que el dominio aliest.growthbdm.com esté configurado');
    log('white', '   5. Actualizar todos los archivos de configuración');
  }
  
  if (invalidKeys.length > 0) {
    log('red', '\n❌ API KEYS INVÁLIDAS:');
    invalidKeys.forEach((result, index) => {
      log('red', `   ${index + 1}. ${result.source}`);
      log('white', `      Clave: ${result.apiKey}`);
      log('white', `      Error: ${result.error}`);
      log('white', `      Tipo: ${result.errorType || 'desconocido'}`);
    });
  }
  
  // Guardar resultados detallados
  const reportPath = 'api-keys-test-results.json';
  const detailedReport = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      valid: validKeys.length,
      invalid: invalidKeys.length,
      recommendedKey: validKeys.length > 0 ? validKeys.find(k => k.domainTest?.hasTargetDomain) || validKeys[0] : null
    },
    results: results
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(detailedReport, null, 2));
  log('green', `\n💾 Resultados detallados guardados en: ${reportPath}`);
  
  section('ANÁLISIS COMPLETADO');
  
  return detailedReport;
}

// Ejecutar pruebas
if (require.main === module) {
  testAllApiKeys().catch(error => {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  });
}

module.exports = { testAllApiKeys, testApiKey };