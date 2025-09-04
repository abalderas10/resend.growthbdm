# Guía Completa para Envío Masivo de Correos

## 📧 Panorama General

Este proyecto está basado en **React Email** y configurado para envío masivo de correos usando **Resend**. El sistema incluye:

- ✅ Templates de email personalizables con React
- ✅ Sistema de envío en lotes con control de velocidad
- ✅ Manejo de errores y reintentos automáticos
- ✅ Validación de destinatarios
- ✅ API REST para integración
- ✅ Personalización de contenido por destinatario

## 🚀 Inicio Rápido

### 1. Configuración Inicial

```bash
# Instalar dependencias
cd react-email
pnpm install

# Copiar variables de entorno
cp .env.example .env.local
```

### 2. Configurar Variables de Entorno

Edita `.env.local` con tus credenciales:

```env
# API Key de Resend (OBLIGATORIO)
RESEND_API_KEY=re_tu_api_key_aqui

# URL de tu aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Configuración de envío
MAX_RECIPIENTS_PER_CAMPAIGN=1000
DEFAULT_BATCH_SIZE=50
DEFAULT_BATCH_DELAY=2000

# Información del remitente
DEFAULT_FROM_EMAIL=tu-email@tudominio.com
DEFAULT_FROM_NAME=Tu Empresa
```

### 3. Ejecutar el Proyecto

```bash
# Ejecutar la aplicación web (puerto 3001)
cd apps/web
pnpm dev

# O ejecutar el playground para desarrollo de templates
cd playground
pnpm dev
```

## 📁 Estructura del Proyecto

```
react-email/
├── templates/                    # Templates de email personalizados
│   └── marketing-campaign.tsx    # Template principal de marketing
├── lib/                         # Lógica de negocio
│   └── mass-email-sender.ts     # Sistema de envío masivo
├── pages/api/                   # Endpoints de API
│   └── send-campaign.ts         # API para envío de campañas
├── examples/                    # Ejemplos de uso
│   └── mass-email-example.ts    # Ejemplos completos
└── apps/
    ├── web/                     # Aplicación Next.js principal
    └── demo/emails/             # Templates de ejemplo
```

## 🎨 Crear Templates de Email

### Template Básico

```tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Img
} from '@react-email/components';

interface MiTemplateProps {
  firstName?: string;
  companyName?: string;
  ctaUrl?: string;
}

export default function MiTemplate({
  firstName = 'Usuario',
  companyName = 'Mi Empresa',
  ctaUrl = '#'
}: MiTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Asunto del email aquí</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Hola {firstName}!</Heading>
          <Text style={text}>
            Gracias por ser parte de {companyName}.
          </Text>
          <Button href={ctaUrl} style={button}>
            Botón de Acción
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos CSS-in-JS
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif'
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px'
};

const h1 = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0'
};

const text = {
  color: '#666666',
  fontSize: '16px',
  lineHeight: '26px'
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px'
};
```

## 📤 Envío Masivo de Correos

### Método 1: Usando la Clase MassEmailSender

```typescript
import { MassEmailSender, createCampaign, EmailRecipient } from './lib/mass-email-sender';
import MiTemplate from './templates/mi-template';
import { createElement } from 'react';

// Definir destinatarios
const recipients: EmailRecipient[] = [
  {
    email: 'cliente1@ejemplo.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    customData: {
      segment: 'premium',
      lastPurchase: '2024-01-15'
    }
  },
  {
    email: 'cliente2@ejemplo.com',
    firstName: 'María',
    lastName: 'González'
  }
];

// Crear template
const template = createElement(MiTemplate, {
  companyName: 'Mi Empresa',
  ctaUrl: 'https://miempresa.com/oferta'
});

// Crear campaña
const campaign = createCampaign(
  'Oferta especial para {{firstName}}', // Asunto personalizable
  template,
  recipients,
  {
    fromEmail: 'ofertas@miempresa.com',
    fromName: 'Equipo de Ofertas',
    batchSize: 50,        // Emails por lote
    delayBetweenBatches: 2000  // Delay en ms entre lotes
  }
);

// Enviar campaña
const sender = new MassEmailSender();
const result = await sender.sendCampaign(campaign);

console.log(`Enviados: ${result.totalSent}`);
console.log(`Fallidos: ${result.totalFailed}`);
```

### Método 2: Usando la API REST

```typescript
// POST /api/send-campaign
const response = await fetch('/api/send-campaign', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer tu-api-key'
  },
  body: JSON.stringify({
    campaignType: 'marketing',
    subject: 'Oferta especial para {{firstName}}',
    recipients: [
      {
        email: 'cliente@ejemplo.com',
        firstName: 'Cliente',
        lastName: 'Ejemplo'
      }
    ],
    templateData: {
      companyName: 'Mi Empresa',
      ctaUrl: 'https://miempresa.com/oferta'
    },
    options: {
      batchSize: 50,
      delayBetweenBatches: 2000
    }
  })
});

const result = await response.json();
```

## 🔧 Configuración Avanzada

### Personalización por Destinatario

```typescript
const recipients: EmailRecipient[] = [
  {
    email: 'vip@ejemplo.com',
    firstName: 'Cliente',
    lastName: 'VIP',
    customData: {
      segment: 'vip',
      discount: '30%',
      specialOffer: 'Acceso exclusivo'
    }
  }
];

// En el template, puedes acceder a customData
const template = createElement(MiTemplate, {
  // Los datos personalizados se pueden usar aquí
  discount: '{{customData.discount}}',
  specialMessage: '{{customData.specialOffer}}'
});
```

### Control de Velocidad de Envío

```typescript
// Envío lento para listas grandes
const slowSender = new MassEmailSender(
  25,    // 25 emails por lote
  5000   // 5 segundos entre lotes
);

// Envío rápido para listas pequeñas
const fastSender = new MassEmailSender(
  100,   // 100 emails por lote
  1000   // 1 segundo entre lotes
);
```

### Validación de Destinatarios

```typescript
const { valid, invalid } = MassEmailSender.validateRecipients(recipients);

if (invalid.length > 0) {
  console.warn('Emails inválidos:', invalid);
}

// Continuar solo con emails válidos
const campaign = createCampaign(subject, template, valid);
```

## 📊 Monitoreo y Análisis

### Análisis de Resultados

```typescript
const result = await sender.sendCampaign(campaign);

// Analizar emails fallidos
const failedEmails = result.results
  .filter(r => !r.success)
  .map(r => ({
    email: r.recipient,
    error: r.error,
    timestamp: r.timestamp
  }));

// Calcular tasa de éxito
const successRate = (result.totalSent / (result.totalSent + result.totalFailed)) * 100;
console.log(`Tasa de éxito: ${successRate.toFixed(2)}%`);
```

### Logging y Debugging

```typescript
// Habilitar logs detallados
process.env.DEBUG = 'mass-email-sender';

// El sistema automáticamente loggeará:
// - Inicio y fin de cada lote
// - Errores individuales
// - Estadísticas finales
```

## 🛡️ Mejores Prácticas

### 1. Gestión de Listas
- ✅ Valida emails antes de enviar
- ✅ Mantén listas actualizadas
- ✅ Respeta las preferencias de unsubscribe
- ✅ Segmenta tu audiencia

### 2. Velocidad de Envío
- ✅ Usa lotes de 50-100 emails
- ✅ Delay de 1-3 segundos entre lotes
- ✅ Monitorea límites de Resend
- ✅ Ajusta velocidad según respuesta del servidor

### 3. Contenido
- ✅ Personaliza asuntos y contenido
- ✅ Incluye siempre link de unsubscribe
- ✅ Optimiza para móviles
- ✅ Prueba templates antes de envío masivo

### 4. Monitoreo
- ✅ Trackea tasas de entrega
- ✅ Monitorea bounces y quejas
- ✅ Analiza métricas de engagement
- ✅ Mantén logs de envíos

## 🚨 Límites y Consideraciones

### Límites de Resend
- **Plan gratuito**: 100 emails/día
- **Plan Pro**: 50,000 emails/mes
- **Rate limit**: ~14 emails/segundo

### Recomendaciones
- Máximo 1,000 destinatarios por campaña
- Usa delays apropiados para evitar rate limiting
- Implementa retry logic para errores temporales
- Monitorea métricas de deliverability

## 🔍 Troubleshooting

### Errores Comunes

1. **"API key not found"**
   - Verifica que `RESEND_API_KEY` esté configurado
   - Confirma que la API key sea válida

2. **"Rate limit exceeded"**
   - Aumenta el delay entre lotes
   - Reduce el tamaño de los lotes

3. **"Invalid email address"**
   - Usa `validateRecipients()` antes de enviar
   - Verifica formato de emails

4. **"Template rendering failed"**
   - Verifica que todas las props requeridas estén presentes
   - Revisa la sintaxis del template

### Debug Mode

```bash
# Habilitar logs detallados
DEBUG=mass-email-sender npm run dev
```

## 📚 Recursos Adicionales

- [Documentación de React Email](https://react.email)
- [API de Resend](https://resend.com/docs)
- [Ejemplos de templates](./apps/demo/emails/)
- [Guía de mejores prácticas](https://resend.com/docs/best-practices)

## 🤝 Soporte

Para soporte técnico:
1. Revisa esta documentación
2. Consulta los ejemplos en `/examples/`
3. Verifica logs de error
4. Contacta al equipo de desarrollo

---

**¡Listo para enviar emails masivos! 🚀**