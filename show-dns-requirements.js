console.log('📋 Registros DNS requeridos para aliest.growthbdm.com en Resend');
console.log('=' .repeat(60));
console.log('');

console.log('🔧 CONFIGURACIÓN TÍPICA DE REGISTROS DNS PARA RESEND:');
console.log('');

// Registros SPF
console.log('1️⃣ REGISTRO SPF (TXT):');
console.log('   Tipo: TXT');
console.log('   Nombre: aliest.growthbdm.com (o @ si tu proveedor lo requiere)');
console.log('   Valor: v=spf1 include:_spf.resend.com ~all');
console.log('   TTL: 3600 (1 hora)');
console.log('   📝 Función: Autoriza a Resend para enviar emails desde tu dominio');
console.log('');

// Registros DKIM
console.log('2️⃣ REGISTRO DKIM (TXT):');
console.log('   Tipo: TXT');
console.log('   Nombre: resend._domainkey.aliest.growthbdm.com');
console.log('   Valor: [Valor específico proporcionado por Resend en el dashboard]');
console.log('   TTL: 3600 (1 hora)');
console.log('   📝 Función: Firma digital para autenticar emails');
console.log('');

// Registro DMARC (opcional pero recomendado)
console.log('3️⃣ REGISTRO DMARC (TXT) - Opcional pero recomendado:');
console.log('   Tipo: TXT');
console.log('   Nombre: _dmarc.aliest.growthbdm.com');
console.log('   Valor: v=DMARC1; p=quarantine; rua=mailto:dmarc@aliest.growthbdm.com');
console.log('   TTL: 3600 (1 hora)');
console.log('   📝 Función: Política de autenticación y reportes');
console.log('');

// Registro MX (si quieres recibir emails)
console.log('4️⃣ REGISTRO MX (Opcional - solo si quieres recibir emails):');
console.log('   Tipo: MX');
console.log('   Nombre: aliest.growthbdm.com');
console.log('   Valor: 10 mx.resend.com');
console.log('   TTL: 3600 (1 hora)');
console.log('   📝 Función: Permite recibir emails en el dominio');
console.log('');

console.log('=' .repeat(60));
console.log('');
console.log('📍 PASOS PARA CONFIGURAR:');
console.log('');
console.log('1. 🌐 Accede al panel de control de tu proveedor DNS');
console.log('   (donde compraste el dominio: GoDaddy, Namecheap, Cloudflare, etc.)');
console.log('');
console.log('2. 🔍 Busca la sección "DNS Management" o "Gestión DNS"');
console.log('');
console.log('3. ➕ Añade los registros mostrados arriba:');
console.log('   - Empieza con el registro SPF (es el más importante)');
console.log('   - Luego añade el DKIM (necesitas el valor específico de Resend)');
console.log('   - Opcionalmente añade DMARC y MX');
console.log('');
console.log('4. 💾 Guarda los cambios');
console.log('');
console.log('5. ⏰ Espera la propagación DNS (puede tardar de 15 minutos a 48 horas)');
console.log('');
console.log('6. ✅ Verifica en el dashboard de Resend que el dominio esté verificado');
console.log('');

console.log('=' .repeat(60));
console.log('');
console.log('🚨 IMPORTANTE:');
console.log('');
console.log('• El valor DKIM específico DEBE obtenerse desde el dashboard de Resend');
console.log('• Cada dominio tiene un valor DKIM único');
console.log('• Si ya tienes registros SPF, combínalos: v=spf1 include:_spf.resend.com include:otro.com ~all');
console.log('• Algunos proveedores DNS requieren @ en lugar del nombre completo del dominio');
console.log('');

console.log('🔗 ENLACES ÚTILES:');
console.log('');
console.log('• Dashboard de Resend: https://resend.com/domains');
console.log('• Documentación DNS: https://resend.com/docs/dashboard/domains/introduction');
console.log('• Verificador DNS: https://mxtoolbox.com/SuperTool.aspx');
console.log('');

console.log('=' .repeat(60));
console.log('');
console.log('💡 PRÓXIMOS PASOS:');
console.log('');
console.log('1. Ve al dashboard de Resend (https://resend.com/domains)');
console.log('2. Busca el dominio aliest.growthbdm.com');
console.log('3. Copia el valor DKIM específico mostrado allí');
console.log('4. Configura todos los registros en tu proveedor DNS');
console.log('5. Ejecuta: node verify-resend-config.js para verificar');
console.log('');