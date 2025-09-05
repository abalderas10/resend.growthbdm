/**
 * Debug Detallado de Respuestas de Resend API
 * 
 * Este script inspecciona en detalle las respuestas de la API de Resend
 * para entender exactamente qué está devolviendo.
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
  log('cyan', `🔍 ${title}`);
  console.log('='.repeat(60));
}

function inspectObject(obj, name, depth = 0) {
  const indent = '  '.repeat(depth);
  
  if (obj === null) {
    log('red', `${indent}${name}: null`);
    return;
  }
  
  if (obj === undefined) {
    log('red', `${indent}${name}: undefined`);
    return;
  }
  
  const type = typeof obj;
  log('blue', `${indent}${name} (${type}):`);
  
  if (type === 'object') {
    if (Array.isArray(obj)) {
      log('white', `${indent}  Array con ${obj.length} elementos`);
      if (obj.length > 0) {
        log('white', `${indent}  Primer elemento:`);
        inspectObject(obj[0], '[0]', depth + 2);
      }
    } else {
      const keys = Object.keys(obj);
      log('white', `${indent}  Propiedades: ${keys.join(', ')}`);
      
      keys.forEach(key => {
        if (depth < 3) { // Limitar profundidad para evitar recursión infinita
          inspectObject(obj[key], key, depth + 1);
        }
      });
    }
  } else {
    log('white', `${indent}  Valor: ${obj}`);
  }
}

async function debugApiKey(apiKey, source) {
  section(`DEBUG API KEY: ${source}`);
  
  log('blue', `🔑 API Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 4)}`);
  log('white', `📏 Longitud: ${apiKey.length} caracteres`);
  log('white', `🏷️  Formato: ${apiKey.startsWith('re_') ? '✅ Válido' : '❌ Inválido'}`);
  
  try {
    const resend = new Resend(apiKey);
    log('green', '✅ Instancia de Resend creada exitosamente');
    
    // Inspeccionar la instancia de Resend
    log('white', '\n🔍 Inspeccionando instancia de Resend:');
    log('white', `   Tipo: ${typeof resend}`);
    log('white', `   Constructor: ${resend.constructor.name}`);
    log('white', `   Propiedades: ${Object.keys(resend).join(', ')}`);
    
    // Verificar si tiene el método domains
    if (resend.domains) {
      log('green', '✅ Método domains disponible');
      log('white', `   Tipo de domains: ${typeof resend.domains}`);
      
      if (resend.domains.list) {
        log('green', '✅ Método domains.list disponible');
        log('white', `   Tipo de domains.list: ${typeof resend.domains.list}`);
        
        // Intentar llamar al método
        log('white', '\n📡 Llamando a resend.domains.list()...');
        
        const startTime = Date.now();
        const response = await resend.domains.list();
        const endTime = Date.now();
        
        log('green', `✅ Respuesta recibida en ${endTime - startTime}ms`);
        
        // Inspeccionar la respuesta completa
        log('white', '\n🔍 Inspeccionando respuesta completa:');
        inspectObject(response, 'response');
        
        // Guardar respuesta raw para análisis
        const debugData = {
          timestamp: new Date().toISOString(),
          apiKey: apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 4),
          source: source,
          responseTime: endTime - startTime,
          response: response,
          responseType: typeof response,
          responseKeys: response ? Object.keys(response) : null,
          responseStringified: JSON.stringify(response, null, 2)
        };
        
        const debugFile = `debug-${source.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.json`;
        fs.writeFileSync(debugFile, JSON.stringify(debugData, null, 2));
        log('green', `💾 Debug data guardado en: ${debugFile}`);
        
        // Intentar acceder a response.data específicamente
        log('white', '\n🎯 Analizando response.data:');
        if (response.hasOwnProperty('data')) {
          log('green', '✅ Propiedad "data" existe');
          inspectObject(response.data, 'data');
          
          if (Array.isArray(response.data)) {
            log('green', `✅ response.data es un array con ${response.data.length} elementos`);
            
            if (response.data.length > 0) {
              log('white', '\n📋 Primer dominio:');
              inspectObject(response.data[0], 'domain[0]');
            } else {
              log('yellow', '⚠️  Array de dominios está vacío');
            }
          } else {
            log('red', `❌ response.data NO es un array. Tipo: ${typeof response.data}`);
          }
        } else {
          log('red', '❌ Propiedad "data" NO existe en la respuesta');
          log('white', '   Propiedades disponibles:');
          if (response && typeof response === 'object') {
            Object.keys(response).forEach(key => {
              log('white', `     - ${key}: ${typeof response[key]}`);
            });
          }
        }
        
      } else {
        log('red', '❌ Método domains.list NO disponible');
      }
    } else {
      log('red', '❌ Propiedad domains NO disponible');
    }
    
  } catch (error) {
    log('red', `❌ Error durante el debug: ${error.message}`);
    log('white', `   Tipo de error: ${error.constructor.name}`);
    log('white', `   Stack trace: ${error.stack}`);
    
    // Guardar error para análisis
    const errorData = {
      timestamp: new Date().toISOString(),
      apiKey: apiKey.substring(0, 15) + '...' + apiKey.substring(apiKey.length - 4),
      source: source,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack
      }
    };
    
    const errorFile = `error-${source.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.json`;
    fs.writeFileSync(errorFile, JSON.stringify(errorData, null, 2));
    log('green', `💾 Error data guardado en: ${errorFile}`);
  }
}

async function debugAllApiKeys() {
  section('DEBUG DETALLADO DE API KEYS');
  
  // API Keys a debuggear
  const apiKeysToDebug = [
    {
      key: 're_dasBV1Zg_AMiUPvNEbckHW61U3hJYK8ZX',
      source: 'env_local_and_web'
    },
    {
      key: 're_5qZePDtW_K4oimtTzkwMW6sMPvLoXYyUC',
      source: 'vercel_json'
    }
  ];
  
  for (const apiKeyInfo of apiKeysToDebug) {
    await debugApiKey(apiKeyInfo.key, apiKeyInfo.source);
    
    // Pausa entre pruebas
    log('white', '\n⏱️  Esperando 2 segundos antes de la siguiente prueba...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  section('DEBUG COMPLETADO');
  
  // Resumen final
  log('magenta', '📋 RESUMEN DEL DEBUG:');
  log('white', '   - Se han generado archivos de debug detallados');
  log('white', '   - Revisa los archivos JSON generados para más detalles');
  log('white', '   - Si todas las API keys fallan, necesitas generar una nueva');
  
  log('cyan', '\n🔗 Enlaces útiles:');
  log('white', '   - Dashboard de Resend: https://resend.com/domains');
  log('white', '   - API Keys: https://resend.com/api-keys');
  log('white', '   - Documentación: https://resend.com/docs');
}

// Ejecutar debug
if (require.main === module) {
  debugAllApiKeys().catch(error => {
    console.error('❌ Error durante el debug:', error);
    process.exit(1);
  });
}

module.exports = { debugAllApiKeys, debugApiKey };