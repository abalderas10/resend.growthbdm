require('dotenv').config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function addMipimDomain() {
  try {
    console.log('🔧 Agregando dominio mipim.aliest.growthbdm.com a Resend...');
    
    const response = await fetch('https://api.resend.com/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        name: 'mipim.aliest.growthbdm.com'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Dominio agregado exitosamente:');
      console.log('Domain ID:', data.id);
      console.log('Domain Name:', data.name);
      console.log('Status:', data.status);
      console.log('\n📋 Registros DNS requeridos:');
      console.log('\n1. MX Record:');
      console.log('   Name: send.mipim');
      console.log('   Type: MX');
      console.log('   Value:', data.records.find(r => r.record === 'MX')?.value || 'N/A');
      console.log('   Priority: 10');
      
      console.log('\n2. TXT SPF Record:');
      console.log('   Name: send.mipim');
      console.log('   Type: TXT');
      console.log('   Value:', data.records.find(r => r.record === 'TXT' && r.value.includes('spf1'))?.value || 'N/A');
      
      console.log('\n3. TXT DKIM Record:');
      console.log('   Name: resend._domainkey.mipim');
      console.log('   Type: TXT');
      console.log('   Value:', data.records.find(r => r.record === 'TXT' && r.name.includes('_domainkey'))?.value || 'N/A');
      
      console.log('\n⚠️  Importante: Debes agregar estos registros DNS en tu proveedor de DNS para verificar el dominio.');
      console.log('💡 Una vez agregados los registros, usa el botón "Verify DNS Records" en el dashboard de Resend.');
    } else {
      console.error('❌ Error al agregar dominio:', data);
      if (data.message && data.message.includes('already exists')) {
        console.log('\n🔍 El dominio ya existe. Verificando estado actual...');
        await checkDomainStatus();
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function checkDomainStatus() {
  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      const mipimDomain = data.data.find(domain => domain.name === 'mipim.aliest.growthbdm.com');
      
      if (mipimDomain) {
        console.log('\n📊 Estado del dominio mipim.aliest.growthbdm.com:');
        console.log('ID:', mipimDomain.id);
        console.log('Status:', mipimDomain.status);
        console.log('Created:', mipimDomain.created_at);
        
        if (mipimDomain.status === 'verified') {
          console.log('✅ El dominio ya está verificado y listo para usar!');
        } else {
          console.log('⚠️  El dominio necesita verificación DNS.');
          console.log('💡 Revisa los registros DNS en tu proveedor.');
        }
      } else {
        console.log('❌ Dominio mipim.aliest.growthbdm.com no encontrado.');
      }
    } else {
      console.error('❌ Error al obtener dominios:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addMipimDomain();