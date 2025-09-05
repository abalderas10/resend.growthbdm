const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testApiKey() {
  try {
    console.log('🔍 Probando API key desde .env.local...');
    console.log('API Key:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : 'No encontrada');
    
    // Intentar obtener dominios
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error al conectar con Resend:', errorData);
      
      if (response.status === 401) {
        console.log('\n💡 El API key no es válido. Necesitas:');
        console.log('1. Ir a https://resend.com/api-keys');
        console.log('2. Generar un nuevo API key');
        console.log('3. Actualizar el archivo .env.local con el nuevo key');
      }
      return;
    }

    const data = await response.json();
    console.log('\n✅ Conexión exitosa con Resend!');
    console.log('📋 Dominios configurados:');
    
    if (data.data && data.data.length > 0) {
      data.data.forEach((domain, index) => {
        console.log(`\n${index + 1}. ${domain.name}`);
        console.log(`   Estado: ${domain.status}`);
        console.log(`   Región: ${domain.region}`);
        console.log(`   Creado: ${domain.created_at}`);
      });
      
      // Verificar si aliest.growthbdm.com está en la lista
      const aliestDomain = data.data.find(d => d.name === 'aliest.growthbdm.com');
      if (aliestDomain) {
        console.log('\n🎉 ¡Perfecto! El dominio aliest.growthbdm.com está configurado y verificado.');
        console.log('Estado:', aliestDomain.status);
      } else {
        console.log('\n⚠️  El dominio aliest.growthbdm.com no aparece en la lista.');
        console.log('Verifica que esté añadido en el dashboard de Resend.');
      }
    } else {
      console.log('   No se encontraron dominios configurados.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar la prueba
testApiKey();