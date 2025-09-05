# Guía para Ver y Editar Plantillas en Railway

## ✅ Email de Prueba Enviado Exitosamente

Se ha enviado un email de prueba a `abalderaas10@proton.me` usando la plantilla MIPIM. El sistema está funcionando correctamente en modo simulación.

**Detalles del envío:**
- ✅ Destinatario: abalderaas10@proton.me
- ✅ Campaign ID: sim_campaign_1757032663217
- ✅ Status: Simulado (RESEND_API_KEY no configurada con clave real)

## 🚀 Cómo Ver y Editar Plantillas en Railway

### 1. Acceder al Dashboard de Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **resend-react**

### 2. Navegar a los Archivos del Proyecto

**Opción A: Usar el Editor Web de Railway**
1. En el dashboard de Railway, haz clic en tu servicio
2. Ve a la pestaña **"Settings"**
3. Busca la sección **"Source Repo"** y haz clic en **"View Source"**
4. Esto te llevará al repositorio en GitHub donde puedes editar los archivos

**Opción B: Clonar el Repositorio Localmente**
```bash
git clone [URL_DE_TU_REPOSITORIO]
cd resend-react
```

### 3. Ubicación de las Plantillas

Las plantillas de email se encuentran en:

```
apps/web/src/emails/
├── mipim-invitation.tsx          # Plantilla MIPIM
└── [otras-plantillas].tsx        # Otras plantillas
```

### 4. Estructura de una Plantilla

Cada plantilla es un componente React con esta estructura:

```typescript
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

interface EmailProps {
  recipientName?: string;
  eventDate?: string;
  eventLocation?: string;
  customMessage?: string;
  magicLinkUrl?: string;
}

export default function MipimInvitationEmail({
  recipientName = 'Estimado/a',
  eventDate = 'Próximamente',
  eventLocation = 'Por confirmar',
  customMessage = '',
  magicLinkUrl = '#'
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Body>
        {/* Contenido del email */}
      </Body>
    </Html>
  );
}
```

### 5. Editar Plantillas

**Para editar una plantilla existente:**

1. Abre el archivo de la plantilla (ej: `mipim-invitation.tsx`)
2. Modifica el contenido HTML/React según necesites
3. Puedes cambiar:
   - Textos y mensajes
   - Estilos CSS
   - Estructura del layout
   - Imágenes y logos
   - Botones y enlaces

**Ejemplo de modificación:**
```typescript
// Cambiar el título
<Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
  ¡Nueva Invitación MIPIM 2025!
</Text>

// Cambiar colores
<Button 
  href={magicLinkUrl}
  style={{ 
    backgroundColor: '#007bff', // Nuevo color azul
    color: 'white',
    padding: '12px 24px'
  }}
>
  Confirmar Asistencia
</Button>
```

### 6. Crear Nueva Plantilla

1. Crea un nuevo archivo en `apps/web/src/emails/`
2. Copia la estructura base de una plantilla existente
3. Personaliza el contenido según tus necesidades
4. Exporta el componente

### 7. Probar Cambios Localmente

```bash
# En el directorio apps/web
pnpm dev

# El servidor se ejecutará en http://localhost:3000
# Puedes ver las plantillas en el navegador
```

### 8. Desplegar Cambios en Railway

**Opción A: Push a GitHub (Recomendado)**
```bash
git add .
git commit -m "Actualizar plantilla MIPIM"
git push origin main
```
Railway detectará automáticamente los cambios y desplegará la nueva versión.

**Opción B: Deploy Manual**
1. En el dashboard de Railway
2. Ve a la pestaña **"Deployments"**
3. Haz clic en **"Deploy Now"**

### 9. Variables de Entorno en Railway

Para configurar las variables de entorno:

1. Ve al dashboard de Railway
2. Selecciona tu servicio
3. Ve a la pestaña **"Variables"**
4. Agrega/edita las variables necesarias:
   - `RESEND_API_KEY`: Tu clave real de Resend
   - `API_SECRET_KEY`: Clave de seguridad para el API
   - `DEFAULT_FROM_EMAIL`: Email remitente
   - Otras configuraciones

### 10. Monitorear Logs

Para ver los logs de la aplicación:

1. En Railway, ve a la pestaña **"Logs"**
2. Aquí puedes ver errores, requests, y actividad general
3. Útil para debuggear problemas

## 🔧 Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Construir para producción
pnpm build

# Enviar email de prueba
node send-test-mipim.js
```

## 📧 Endpoints Disponibles

- `POST /api/send-mipim-invitations` - Enviar invitaciones MIPIM
- `POST /api/send-campaign` - Enviar campañas masivas

## 🎯 Próximos Pasos

1. Configurar una clave real de Resend en Railway
2. Personalizar las plantillas según tu marca
3. Configurar dominio personalizado
4. Implementar tracking de emails

---

**¡El sistema está listo para usar!** 🚀

Puedes comenzar a enviar emails reales configurando una clave válida de Resend en las variables de entorno de Railway.