require('dotenv').config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function checkMipimDomain() {
  console.log('Checking MIPIM domain status...');
  
  try {
    // First, list all domains
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`
      }
    });

    const data = await response.json();
    console.log('API Response Status:', response.status);
    
    if (response.ok) {
      console.log('Total domains:', data.data.length);
      
      // Look for mipim domain
      const mipimDomain = data.data.find(domain => domain.name.includes('mipim'));
      
      if (mipimDomain) {
        console.log('MIPIM Domain found:');
        console.log('- Name:', mipimDomain.name);
        console.log('- Status:', mipimDomain.status);
        console.log('- ID:', mipimDomain.id);
      } else {
        console.log('MIPIM domain not found. Available domains:');
        data.data.forEach(domain => {
          console.log('- ' + domain.name + ' (' + domain.status + ')');
        });
        
        console.log('\nTrying to add mipim.aliest.growthbdm.com...');
        await addMipimDomain();
      }
    } else {
      console.error('Error fetching domains:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function addMipimDomain() {
  try {
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
    console.log('Add domain response status:', response.status);
    console.log('Add domain response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error adding domain:', error.message);
  }
}

checkMipimDomain();