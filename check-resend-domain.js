const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function checkDomainConfiguration() {
  try {
    console.log('🔍 Verificando configuración de dominios en Resend...');
    console.log('API Key:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : 'No configurada');
    
    // Listar todos los dominios
    const { data: domains, error: domainsError } = await resend.domains.list();
    
    if (domainsError) {
      console.error('❌ Error al obtener dominios:', domainsError);
      return;
    }
    
    console.log('\n📋 Dominios configurados en Resend:');
    if (domains && domains.data && domains.data.length > 0) {
      domains.data.forEach(domain => {
        console.log(`  - ${domain.name} (${domain.status}) - ID: ${domain.id}`);
        console.log(`    Región: ${domain.region || 'No especificada'}`);
        console.log(`    Creado: ${domain.created_at}`);
      });
    } else {
      console.log('  ❌ No hay dominios configurados');
    }
    
    // Verificar específicamente aliest.growthbdm.com
    const targetDomain = 'aliest.growthbdm.com';
    const domainExists = domains?.data?.find(d => d.name === targetDomain);
    
    console.log(`\n🎯 Verificando dominio específico: ${targetDomain}`);
    if (domainExists) {
      console.log(`  ✅ Dominio encontrado: ${domainExists.name}`);
      console.log(`  📊 Estado: ${domainExists.status}`);
      console.log(`  🆔 ID: ${domainExists.id}`);
      
      if (domainExists.status !== 'verified') {
        console.log('  ⚠️  El dominio no está verificado. Necesitas:');
        console.log('     1. Configurar registros DNS (SPF, DKIM, MX)');
        console.log('     2. Verificar el dominio en el dashboard de Resend');
        console.log('     3. Esperar la verificación (puede tomar hasta 72 horas)');
      }
    } else {
      console.log(`  ❌ Dominio ${targetDomain} NO está configurado en Resend`);
      console.log('  📝 Pasos necesarios:');
      console.log('     1. Ir a https://resend.com/domains');
      console.log('     2. Agregar el dominio aliest.growthbdm.com');
      console.log('     3. Configurar los registros DNS requeridos');
      console.log('     4. Verificar el dominio');
    }
    
    // Verificar FROM_EMAIL
    const fromEmail = process.env.FROM_EMAIL || 'noreply@aliest.growthbdm.com';
    console.log(`\n📧 FROM_EMAIL configurado: ${fromEmail}`);
    
    const emailDomain = fromEmail.split('@')[1];
    if (emailDomain === targetDomain) {
      if (domainExists && domainExists.status === 'verified') {
        console.log('  ✅ El dominio del FROM_EMAIL está verificado');
      } else {
        console.log('  ❌ El dominio del FROM_EMAIL NO está verificado');
      }
    } else {
      console.log(`  ⚠️  El dominio del FROM_EMAIL (${emailDomain}) no coincide con ${targetDomain}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    
    if (error.message.includes('API key is invalid')) {
      console.log('\n🔑 Problema con la API key:');
      console.log('   - Verifica que la API key sea correcta');
      console.log('   - Asegúrate de que no sea una key de ejemplo');
      console.log('   - Verifica que tenga permisos suficientes');
      console.log('   - La API key actual parece ser inválida o expirada');
      console.log('   - Genera una nueva API key en https://resend.com/api-keys');
    }
  }
}

checkDomainConfiguration();