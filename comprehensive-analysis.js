/**
 * Análisis Completo de Configuración React Email + Resend
 * 
 * Este script analiza todas las configuraciones del proyecto para identificar
 * inconsistencias y problemas con la API key de Resend.
 */

const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

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
  log('cyan', `📋 ${title}`);
  console.log('='.repeat(60));
}

function subsection(title) {
  console.log('\n' + '-'.repeat(40));
  log('blue', `🔍 ${title}`);
  console.log('-'.repeat(40));
}

async function analyzeProject() {
  log('magenta', '🚀 ANÁLISIS COMPLETO DEL PROYECTO REACT EMAIL + RESEND');
  log('white', 'Generando informe detallado de configuración...\n');

  const report = {
    timestamp: new Date().toISOString(),
    apiKeys: {},
    envFiles: {},
    configFiles: {},
    dependencies: {},
    apiRoutes: {},
    issues: [],
    recommendations: []
  };

  // 1. ANÁLISIS DE API KEYS
  section('ANÁLISIS DE API KEYS');
  
  // Cargar diferentes archivos .env
  const envFiles = [
    '.env.local',
    'apps/web/.env.local',
    'apps/web/.env',
    '.env'
  ];

  for (const envFile of envFiles) {
    const fullPath = path.resolve(envFile);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        const apiKeyLine = lines.find(line => line.startsWith('RESEND_API_KEY='));
        
        if (apiKeyLine) {
          const apiKey = apiKeyLine.split('=')[1]?.trim();
          report.envFiles[envFile] = {
            exists: true,
            hasApiKey: !!apiKey,
            apiKey: apiKey,
            apiKeyLength: apiKey?.length || 0,
            isValidFormat: apiKey?.startsWith('re_') || false,
            content: content
          };
          
          log('green', `✅ ${envFile}: API Key encontrada`);
          log('white', `   Valor: ${apiKey?.substring(0, 15)}...`);
          log('white', `   Longitud: ${apiKey?.length || 0} caracteres`);
          log('white', `   Formato válido: ${apiKey?.startsWith('re_') ? '✅' : '❌'}`);
        } else {
          report.envFiles[envFile] = {
            exists: true,
            hasApiKey: false
          };
          log('yellow', `⚠️  ${envFile}: No contiene RESEND_API_KEY`);
        }
      } catch (error) {
        log('red', `❌ Error leyendo ${envFile}: ${error.message}`);
      }
    } else {
      report.envFiles[envFile] = { exists: false };
      log('yellow', `⚠️  ${envFile}: No existe`);
    }
  }

  // 2. ANÁLISIS DE ARCHIVOS DE CONFIGURACIÓN
  section('ANÁLISIS DE ARCHIVOS DE CONFIGURACIÓN');
  
  // Verificar vercel.json
  const vercelPath = 'apps/web/vercel.json';
  if (fs.existsSync(vercelPath)) {
    try {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      const vercelApiKey = vercelConfig.env?.RESEND_API_KEY;
      
      report.configFiles.vercel = {
        exists: true,
        hasApiKey: !!vercelApiKey,
        apiKey: vercelApiKey,
        config: vercelConfig
      };
      
      log('green', `✅ vercel.json encontrado`);
      if (vercelApiKey) {
        log('white', `   API Key en vercel.json: ${vercelApiKey.substring(0, 15)}...`);
        log('white', `   Longitud: ${vercelApiKey.length} caracteres`);
      }
    } catch (error) {
      log('red', `❌ Error leyendo vercel.json: ${error.message}`);
    }
  }

  // 3. ANÁLISIS DE DEPENDENCIAS
  section('ANÁLISIS DE DEPENDENCIAS');
  
  const packagePaths = [
    'package.json',
    'apps/web/package.json'
  ];

  for (const pkgPath of packagePaths) {
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const resendVersion = pkg.dependencies?.resend || pkg.devDependencies?.resend;
        
        report.dependencies[pkgPath] = {
          resendVersion,
          reactEmailComponents: pkg.dependencies?.['@react-email/components'],
          nextVersion: pkg.dependencies?.next
        };
        
        log('green', `✅ ${pkgPath}`);
        log('white', `   Resend: ${resendVersion || 'No instalado'}`);
        log('white', `   React Email: ${pkg.dependencies?.['@react-email/components'] || 'No instalado'}`);
        log('white', `   Next.js: ${pkg.dependencies?.next || 'No instalado'}`);
      } catch (error) {
        log('red', `❌ Error leyendo ${pkgPath}: ${error.message}`);
      }
    }
  }

  // 4. ANÁLISIS DE RUTAS API
  section('ANÁLISIS DE RUTAS API');
  
  const apiRoutes = [
    'apps/web/src/app/api/send-mipim-invitations/route.ts',
    'apps/web/src/app/api/send/test/route.ts'
  ];

  for (const routePath of apiRoutes) {
    if (fs.existsSync(routePath)) {
      try {
        const content = fs.readFileSync(routePath, 'utf8');
        const hasResendImport = content.includes('import { Resend }');
        const hasApiKeyUsage = content.includes('process.env.RESEND_API_KEY');
        const hasResendInstance = content.includes('new Resend(');
        
        report.apiRoutes[routePath] = {
          exists: true,
          hasResendImport,
          hasApiKeyUsage,
          hasResendInstance,
          content: content.substring(0, 500) + '...'
        };
        
        log('green', `✅ ${routePath}`);
        log('white', `   Importa Resend: ${hasResendImport ? '✅' : '❌'}`);
        log('white', `   Usa RESEND_API_KEY: ${hasApiKeyUsage ? '✅' : '❌'}`);
        log('white', `   Crea instancia Resend: ${hasResendInstance ? '✅' : '❌'}`);
      } catch (error) {
        log('red', `❌ Error leyendo ${routePath}: ${error.message}`);
      }
    } else {
      log('yellow', `⚠️  ${routePath}: No existe`);
    }
  }

  // 5. PRUEBA DE CONECTIVIDAD
  section('PRUEBA DE CONECTIVIDAD CON RESEND');
  
  // Obtener la API key principal
  const mainApiKey = process.env.RESEND_API_KEY || 
                    report.envFiles['.env.local']?.apiKey ||
                    report.envFiles['apps/web/.env.local']?.apiKey ||
                    report.configFiles.vercel?.apiKey;

  if (mainApiKey) {
    log('blue', `🔑 Probando API Key: ${mainApiKey.substring(0, 15)}...`);
    
    try {
      const resend = new Resend(mainApiKey);
      
      // Probar listado de dominios
      log('white', '   Probando listado de dominios...');
      const domains = await resend.domains.list();
      
      if (domains.data) {
        log('green', `   ✅ Conexión exitosa! Dominios encontrados: ${domains.data.length}`);
        
        domains.data.forEach(domain => {
          log('white', `      - ${domain.name} (${domain.status})`);
          if (domain.name === 'aliest.growthbdm.com') {
            log('green', '        🎯 ¡Dominio aliest.growthbdm.com encontrado!');
          }
        });
        
        report.apiKeys.connectivity = {
          success: true,
          domains: domains.data
        };
      } else {
        log('red', '   ❌ Respuesta inesperada de la API');
        report.issues.push('API devuelve respuesta inesperada');
      }
      
    } catch (error) {
      log('red', `   ❌ Error de conectividad: ${error.message}`);
      report.apiKeys.connectivity = {
        success: false,
        error: error.message
      };
      
      if (error.message.includes('Invalid API key')) {
        report.issues.push('API Key inválida o revocada');
      }
    }
  } else {
    log('red', '❌ No se encontró ninguna API Key para probar');
    report.issues.push('No se encontró API Key en ningún archivo de configuración');
  }

  // 6. ANÁLISIS DE INCONSISTENCIAS
  section('ANÁLISIS DE INCONSISTENCIAS');
  
  const apiKeys = [];
  
  // Recopilar todas las API keys encontradas
  Object.entries(report.envFiles).forEach(([file, data]) => {
    if (data.apiKey) {
      apiKeys.push({ source: file, key: data.apiKey });
    }
  });
  
  if (report.configFiles.vercel?.apiKey) {
    apiKeys.push({ source: 'vercel.json', key: report.configFiles.vercel.apiKey });
  }
  
  // Verificar consistencia
  const uniqueKeys = [...new Set(apiKeys.map(item => item.key))];
  
  if (uniqueKeys.length > 1) {
    log('red', '❌ INCONSISTENCIA DETECTADA: Múltiples API Keys diferentes');
    apiKeys.forEach(item => {
      log('white', `   ${item.source}: ${item.key.substring(0, 15)}...`);
    });
    report.issues.push('Múltiples API Keys diferentes en archivos de configuración');
  } else if (uniqueKeys.length === 1) {
    log('green', '✅ Consistencia: Todas las API Keys son iguales');
  } else {
    log('red', '❌ No se encontraron API Keys');
  }

  // 7. RECOMENDACIONES
  section('RECOMENDACIONES');
  
  if (report.issues.length === 0) {
    log('green', '🎉 ¡No se detectaron problemas graves!');
  } else {
    log('yellow', '⚠️  Problemas detectados:');
    report.issues.forEach((issue, index) => {
      log('red', `   ${index + 1}. ${issue}`);
    });
  }
  
  // Generar recomendaciones
  if (report.issues.includes('API Key inválida o revocada')) {
    report.recommendations.push('Generar nueva API Key en https://resend.com/api-keys');
    report.recommendations.push('Actualizar todos los archivos de configuración con la nueva API Key');
  }
  
  if (report.issues.includes('Múltiples API Keys diferentes en archivos de configuración')) {
    report.recommendations.push('Unificar todas las API Keys para usar la misma en todos los archivos');
  }
  
  if (Object.keys(report.envFiles).every(file => !report.envFiles[file].hasApiKey)) {
    report.recommendations.push('Configurar RESEND_API_KEY en al menos un archivo .env');
  }
  
  log('blue', '💡 Recomendaciones:');
  if (report.recommendations.length === 0) {
    log('green', '   ✅ La configuración parece estar correcta');
  } else {
    report.recommendations.forEach((rec, index) => {
      log('yellow', `   ${index + 1}. ${rec}`);
    });
  }

  // 8. GUARDAR REPORTE
  section('GUARDANDO REPORTE');
  
  const reportPath = 'resend-analysis-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log('green', `✅ Reporte guardado en: ${reportPath}`);
  
  // Resumen final
  section('RESUMEN EJECUTIVO');
  
  log('white', `📊 Archivos .env analizados: ${Object.keys(report.envFiles).length}`);
  log('white', `🔑 API Keys encontradas: ${apiKeys.length}`);
  log('white', `🚨 Problemas detectados: ${report.issues.length}`);
  log('white', `💡 Recomendaciones: ${report.recommendations.length}`);
  
  if (report.apiKeys.connectivity?.success) {
    log('green', '🌐 Estado de conectividad: ✅ EXITOSA');
  } else {
    log('red', '🌐 Estado de conectividad: ❌ FALLIDA');
  }
  
  console.log('\n' + '='.repeat(60));
  log('magenta', '📋 ANÁLISIS COMPLETADO');
  console.log('='.repeat(60));
  
  return report;
}

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: 'apps/web/.env.local' });

// Ejecutar análisis
if (require.main === module) {
  analyzeProject().catch(error => {
    console.error('❌ Error durante el análisis:', error);
    process.exit(1);
  });
}

module.exports = { analyzeProject };