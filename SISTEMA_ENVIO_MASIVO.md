# Sistema de Envío Masivo - React Email

## Descripción General

Este sistema permite enviar correos electrónicos masivos utilizando plantillas personalizadas de React Email y la API de Resend. Incluye soporte para diferentes tipos de campañas, incluyendo invitaciones MIPIM especializadas.

## Configuración Inicial

### Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Key de Resend (obligatorio)
RESEND_API_KEY=re_tu_api_key_aqui

# URL de la aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clave secreta para autenticación de API
API_SECRET_KEY=tu_clave_secreta_aqui

# Configuración de límites de envío
MAX_RECIPIENTS_PER_CAMPAIGN=100
DAILY_EMAIL_LIMIT=1000

# Información del remitente por defecto
DEFAULT_FROM_EMAIL=noreply@tudominio.com
DEFAULT_FROM_NAME=Tu Empresa

# Webhook secret (opcional)
WEBHOOK_SECRET=tu_webhook_secret

# Configuración específica para MIPIM
MIPIM_EVENT_DATE=2024-03-15
MIPIM_EVENT_LOCATION=Cannes, Francia
MIPIM_CUSTOM_MESSAGE=Te invitamos a nuestro evento exclusivo
```

## Tipos de Campañas Disponibles

### 1. Campaña de Marketing General
- **Tipo**: `marketing`
- **Plantilla**: `MarketingCampaignEmail`
- **Campos**: `recipientName`, `companyName`, `campaignMessage`

### 2. Newsletter
- **Tipo**: `newsletter`
- **Plantilla**: `MarketingCampaignEmail`
- **Campos**: `recipientName`, `companyName`, `campaignMessage`

### 3. Notificaciones
- **Tipo**: `notification`
- **Plantilla**: `MarketingCampaignEmail`
- **Campos**: `recipientName`, `companyName`, `campaignMessage`

### 4. Invitaciones MIPIM
- **Tipo**: `mipim`
- **Plantilla**: `InvitationEmailV2`
- **Campos**: `recipientName`, `recipientEmail`, `magicLinkUrl`, `eventDate`, `eventLocation`, `customMessage`

## Endpoints de API

### 1. Envío de Campaña General
**URL**: `/api/send-campaign`
**Método**: `POST`

```javascript
const response = await fetch('/api/send-campaign', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_SECRET_KEY}`
  },
  body: JSON.stringify({
    campaignType: 'marketing', // o 'newsletter', 'notification', 'mipim'
    subject: 'Asunto del correo',
    recipients: [
      {
        email: 'usuario@ejemplo.com',
        name: 'Nombre Usuario'
      }
    ],
    templateData: {
      recipientName: 'Nombre Usuario',
      companyName: 'Mi Empresa',
      campaignMessage: 'Mensaje personalizado'
    }
  })
});
```

### 2. Envío de Invitaciones MIPIM
**URL**: `/api/send-mipim-invitations`
**Método**: `POST`

```javascript
const response = await fetch('/api/send-mipim-invitations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_SECRET_KEY}`
  },
  body: JSON.stringify({
    subject: 'Invitación Exclusiva MIPIM 2024',
    recipients: [
      {
        email: 'invitado@ejemplo.com',
        name: 'Nombre Invitado',
        magicLinkUrl: 'https://evento.com/registro/token123'
      }
    ],
    eventDate: '15 de Marzo, 2024',
    eventLocation: 'Cannes, Francia',
    customMessage: 'Te esperamos en nuestro evento exclusivo'
  })
});
```

## Ejemplos de Uso

### Ejemplo 1: Envío de Newsletter

```javascript
// Archivo: examples/newsletter-example.js
const sendNewsletter = async () => {
  const recipients = [
    { email: 'usuario1@ejemplo.com', name: 'Usuario Uno' },
    { email: 'usuario2@ejemplo.com', name: 'Usuario Dos' }
  ];

  const response = await fetch('http://localhost:3000/api/send-campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
    },
    body: JSON.stringify({
      campaignType: 'newsletter',
      subject: 'Newsletter Mensual - Marzo 2024',
      recipients: recipients,
      templateData: {
        recipientName: 'Estimado Suscriptor',
        companyName: 'Growth BDM',
        campaignMessage: 'Descubre las últimas novedades de nuestro sector'
      }
    })
  });

  const result = await response.json();
  console.log('Newsletter enviado:', result);
};
```

### Ejemplo 2: Invitaciones MIPIM Masivas

```javascript
// Archivo: examples/mipim-invitations.js
const sendMipimInvitations = async () => {
  const invitados = [
    {
      email: 'ceo@empresa1.com',
      name: 'Juan Pérez',
      magicLinkUrl: 'https://evento.com/registro/abc123'
    },
    {
      email: 'director@empresa2.com',
      name: 'María García',
      magicLinkUrl: 'https://evento.com/registro/def456'
    }
  ];

  const response = await fetch('http://localhost:3000/api/send-mipim-invitations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`
    },
    body: JSON.stringify({
      subject: 'Invitación Exclusiva - MIPIM 2024',
      recipients: invitados,
      eventDate: '15-17 de Marzo, 2024',
      eventLocation: 'Palais des Festivals, Cannes',
      customMessage: 'Únete a los líderes del sector inmobiliario'
    })
  });

  const result = await response.json();
  console.log('Invitaciones MIPIM enviadas:', result);
};
```

## Estructura de Respuesta de la API

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Campaign sent successfully",
  "campaignId": "camp_1234567890",
  "emailsSent": 25,
  "results": [
    {
      "email": "usuario@ejemplo.com",
      "status": "sent",
      "messageId": "msg_abc123"
    }
  ]
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Invalid API key",
  "details": "The provided API key is not valid"
}
```

## Límites y Restricciones

- **Máximo de destinatarios por campaña**: 100 (configurable)
- **Límite diario de emails**: 1000 (configurable)
- **Tamaño máximo del mensaje**: 10MB
- **Formatos soportados**: HTML y texto plano

## Monitoreo y Logs

El sistema registra automáticamente:
- Número de emails enviados
- Errores de envío
- Tiempo de procesamiento
- IDs de mensaje para seguimiento

## Solución de Problemas

### Error: "Invalid API key"
- Verifica que `RESEND_API_KEY` esté configurado correctamente
- Asegúrate de que la API key sea válida en Resend

### Error: "Too many recipients"
- Reduce el número de destinatarios por campaña
- Divide la lista en múltiples envíos

### Error: "Daily limit exceeded"
- Espera hasta el siguiente día
- Aumenta el límite en la configuración si es necesario

## Desarrollo Local

1. Instala las dependencias:
```bash
pnpm install
```

2. Configura las variables de entorno en `.env`

3. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

4. Prueba los endpoints en `http://localhost:3000`

## Deployment en Producción

### Railway
1. Configura las variables de entorno en Railway Dashboard
2. Despliega usando `railway up`
3. Verifica que la aplicación esté funcionando

### Variables de Entorno en Producción
Asegúrate de configurar todas las variables de entorno necesarias en tu plataforma de deployment.

## Soporte

Para soporte técnico o preguntas sobre el sistema, contacta al equipo de desarrollo.