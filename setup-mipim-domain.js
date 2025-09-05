require('dotenv').config({ path: '.env.local' });

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function setupMipimDomain() {
  console.log('🚀 Configurando dominio mipim.aliest.growthbdm.com en Resend...');
  
  try {
    // Primero verificar si ya existe
    console.log('\n1️⃣ Verificando dominios existentes...');
    const listResponse = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`
      }
    });

    const existingDomains = await listResponse.json();
    const mipimDomain = existingDomains.data?.find(d => d.name === 'mipim.aliest.growthbdm.com');
    
    if (mipimDomain) {
      console.log('✅ Dominio ya existe en Resend');
      console.log('   - ID:', mipimDomain.id);
      console.log('   - Estado:', mipimDomain.status);
      
      if (mipimDomain.status === 'verified') {
        console.log('🎉 ¡El dominio ya está verificado y listo para usar!');
        return;
      }
      
      // Obtener detalles del dominio para mostrar registros DNS
      await showDNSRecords(mipimDomain.id);
    } else {
      console.log('➕ Dominio no existe, agregándolo...');
      await addMipimDomain();
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function addMipimDomain() {
  try {
    console.log('\n2️⃣ Agregando dominio mipim.aliest.growthbdm.com...');
    
    const response = await fetch('https://api.resend.com/domains', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        name: 'mipim.aliest.growthbdm.com',
        region: 'us-east-1'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Dominio agregado exitosamente!');
      console.log('   - ID:', data.id);
      console.log('   - Nombre:', data.name);
      console.log('   - Estado:', data.status);
      
      await showDNSRecords(data.id, data.records);
    } else {
      console.error('❌ Error al agregar dominio:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function showDNSRecords(domainId, records = null) {
  try {
    if (!records) {
      console.log('\n3️⃣ Obteniendo registros DNS...');
      const response = await fetch(`https://api.resend.com/domains/${domainId}`, {
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`
        }
      });
      
      const data = await response.json();
      records = data.records;
    }
    
    console.log('\n📋 INSTRUCCIONES DNS - Agrega estos registros en tu proveedor de DNS:');
    console.log('=' .repeat(70));
    
    // Buscar registros específicos
    const mxRecord = records?.find(r => r.record === 'MX');
    const spfRecord = records?.find(r => r.record === 'TXT' && r.value?.includes('spf1'));
    const dkimRecord = records?.find(r => r.record === 'TXT' && r.name?.includes('_domainkey'));
    
    if (mxRecord) {
      console.log('\n🔸 REGISTRO MX:');
      console.log('   Tipo: MX');
      console.log('   Nombre: send.mipim');
      console.log('   Valor:', mxRecord.value);
      console.log('   Prioridad: 10');
      console.log('   TTL: 3600 (o automático)');
    }
    
    if (spfRecord) {
      console.log('\n🔸 REGISTRO SPF (TXT):');
      console.log('   Tipo: TXT');
      console.log('   Nombre: send.mipim');
      console.log('   Valor:', spfRecord.value);
      console.log('   TTL: 3600 (o automático)');
    }
    
    if (dkimRecord) {
      console.log('\n🔸 REGISTRO DKIM (TXT):');
      console.log('   Tipo: TXT');
      console.log('   Nombre: resend._domainkey.mipim');
      console.log('   Valor:', dkimRecord.value);
      console.log('   TTL: 3600 (o automático)');
    }
    
    console.log('\n' + '=' .repeat(70));
    console.log('⚠️  IMPORTANTE:');
    console.log('1. Agrega TODOS los registros en tu proveedor de DNS');
    console.log('2. Los nombres deben ser exactos (incluyendo los puntos)');
    console.log('3. Espera 15-30 minutos para propagación DNS');
    console.log('4. Luego ve al Dashboard de Resend y haz clic en "Verify DNS Records"');
    console.log('5. Una vez verificado, cambia el remitente en el código a mipim@aliest.growthbdm.com');
    
    console.log('\n🌐 Dashboard de Resend: https://resend.com/domains');
    
  } catch (error) {
    console.error('❌ Error obteniendo registros DNS:', error.message);
  }
}

setupMipimDomain();