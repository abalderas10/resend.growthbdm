const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Configuración
const RESEND_API_KEY = 're_dasBV1Zg_AMiUPvNEbckHW61U3hJYK8ZX';
const FROM_EMAIL = 'noreply@aliest.growthbdm.com';
const TO_EMAIL = 'abalderas10@gmail.com';

// Inicializar Resend
const resend = new Resend(RESEND_API_KEY);

// Plantilla HTML simple de React Email
const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Correo de Prueba - React Email</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 React Email Test</h1>
        <p>Correo enviado con React Email y Resend</p>
    </div>
    
    <div class="content">
        <h2>¡Hola!</h2>
        <p>Este es un correo de prueba enviado usando:</p>
        <ul>
            <li>✅ React Email para la plantilla</li>
            <li>✅ Resend como proveedor de email</li>
            <li>✅ Dominio verificado: aliest.growthbdm.com</li>
        </ul>
        
        <p>La configuración está funcionando correctamente. Ahora puedes enviar correos desde tu aplicación.</p>
        
        <a href="https://react.email" class="button">Visitar React Email</a>
        
        <h3>Detalles técnicos:</h3>
        <ul>
            <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</li>
            <li><strong>Dominio:</strong> aliest.growthbdm.com</li>
            <li><strong>Estado DNS:</strong> Verificado ✅</li>
        </ul>
    </div>
    
    <div class="footer">
        <p>Este correo fue enviado desde el sistema de pruebas de React Email</p>
        <p>© 2024 Growth BDM - Todos los derechos reservados</p>
    </div>
</body>
</html>
`;

async function sendTestEmail() {
    try {
        console.log('🚀 Enviando correo de prueba...');
        console.log(`📧 Destinatario: ${TO_EMAIL}`);
        console.log(`📤 Remitente: ${FROM_EMAIL}`);
        
        const result = await resend.emails.send({
            from: FROM_EMAIL,
            to: TO_EMAIL,
            subject: '🚀 Prueba de React Email - Configuración Exitosa',
            html: emailTemplate
        });
        
        console.log('✅ Correo enviado exitosamente!');
        console.log('📋 Detalles del envío:');
        console.log(JSON.stringify(result, null, 2));
        
        // Guardar resultado
        const reportData = {
            timestamp: new Date().toISOString(),
            success: true,
            recipient: TO_EMAIL,
            sender: FROM_EMAIL,
            subject: '🚀 Prueba de React Email - Configuración Exitosa',
            result: result,
            message: 'Correo enviado exitosamente con plantilla React Email'
        };
        
        fs.writeFileSync(
            path.join(__dirname, 'email-sent-report.json'),
            JSON.stringify(reportData, null, 2)
        );
        
        console.log('\n📄 Reporte guardado en: email-sent-report.json');
        console.log('\n🎉 ¡Configuración de React Email completamente funcional!');
        
    } catch (error) {
        console.error('❌ Error al enviar el correo:');
        console.error(error);
        
        // Guardar error
        const errorData = {
            timestamp: new Date().toISOString(),
            success: false,
            recipient: TO_EMAIL,
            sender: FROM_EMAIL,
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name
            }
        };
        
        fs.writeFileSync(
            path.join(__dirname, 'email-error-report.json'),
            JSON.stringify(errorData, null, 2)
        );
        
        console.log('\n📄 Reporte de error guardado en: email-error-report.json');
    }
}

// Ejecutar el envío
sendTestEmail();