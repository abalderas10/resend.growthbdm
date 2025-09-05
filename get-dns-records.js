const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function getDNSRecords() {
  try {
    console.log('🔍 Obteniendo registros DNS para aliest.growthbdm.com...');
    console.log('API Key:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : 'No configurada');
    
    // Obtener información del dominio específico
    const response = await fetch('https://api.resend.com/domains/aliest.growthbdm.com', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error al obtener información del dominio:', errorData);
      
      if (response.status === 401) {
        console.log('\n💡 Sugerencias:');
        console.log('1. Verifica que el API key sea válido en https://resend.com/api-keys');
        console.log('2. Asegúrate de que el API key tenga permisos para leer dominios');
        console.log('3. Genera un nuevo API key si es necesario');
      }
      return;
    }

    const domainData = await response.json();
    console.log('\n✅ Información del dominio aliest.growthbdm.com:');
    console.log('Estado:', domainData.status);
    console.log('Región:', domainData.region || 'No especificada');
    console.log('Creado:', domainData.created_at);
    
    if (domainData.records && domainData.records.length > 0) {
      console.log('\n📋 Registros DNS requeridos:');
      console.log('=' .repeat(50));
      
      domainData.records.forEach((record, index) => {
        console.log(`\n${index + 1}. Tipo: ${record.record}`);
        console.log(`   Nombre: ${record.name}`);
        console.log(`   Valor: ${record.value}`);
        console.log(`   TTL: ${record.ttl || 'Auto'}`);
        
        // Explicar qué hace cada registro
        if (record.record === 'TXT' && record.name.includes('_dmarc')) {
          console.log('   📝 Función: Registro DMARC para política de autenticación');
        } else if (record.record === 'TXT' && record.value.includes('v=spf1')) {
          console.log('   📝 Función: Registro SPF para autorizar servidores de envío');
        } else if (record.record === 'TXT' && record.name.includes('._domainkey')) {
          console.log('   📝 Función: Registro DKIM para firma digital de emails');
        } else if (record.record === 'MX') {
          console.log('   📝 Función: Registro MX para recepción de emails');
        } else if (record.record === 'CNAME') {
          console.log('   📝 Función: Registro CNAME para redirección de dominio');
        }
      });
      
      console.log('\n' + '=' .repeat(50));
      console.log('\n💡 Instrucciones:');
      console.log('1. Accede al panel de control de tu proveedor DNS (donde compraste el dominio)');
      console.log('2. Busca la sección "Gestión DNS" o "DNS Management"');
      console.log('3. Añade cada uno de los registros mostrados arriba');
      console.log('4. Guarda los cambios y espera la propagación DNS (puede tardar hasta 48 horas)');
      console.log('5. Verifica la configuración ejecutando: node verify-resend-config.js');
      
    } else {
      console.log('\n⚠️  No se encontraron registros DNS específicos.');
      console.log('Esto puede significar que:');
      console.log('- El dominio ya está completamente verificado');
      console.log('- Los registros se configuraron automáticamente');
      console.log('- Hay un problema con la respuesta de la API');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Verifica tu conexión a internet y que el API key sea válido.');
    }
  }
}

// Ejecutar la función
getDNSRecords();