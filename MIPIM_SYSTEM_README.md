# Sistema de Gestión MIPIM - Dashboard Administrativo

## 📋 Descripción General

Sistema completo de gestión de invitaciones y tracking de emails para eventos MIPIM, construido con Next.js, Supabase y Resend. Incluye dashboard administrativo con autenticación basada en roles, gestión de campañas, tracking en tiempo real y configuración de webhooks.

## 🚀 Funcionalidades Implementadas

### ✅ APIs Completadas
- **`/api/mipim-invitations`** - Gestión de invitaciones MIPIM
- **`/api/email-tracking`** - Tracking de eventos de email
- **`/api/webhooks`** - Configuración y gestión de webhooks

### ✅ Componentes del Dashboard
- **`AdminDashboard.tsx`** - Panel principal de administración
- **`EmailTracker.tsx`** - Visualización y gestión de tracking
- **`WebhookConfig.tsx`** - Configuración de webhooks
- **`pages/dashboard.tsx`** - Página principal del dashboard
- **`pages/login.tsx`** - Sistema de autenticación

### ✅ Base de Datos Configurada
- Esquema completo en Supabase
- Políticas RLS implementadas
- Índices optimizados
- Tablas para usuarios, contactos, campañas, templates y tracking

## 🔧 Configuración del Entorno

### Variables de Entorno Requeridas

El archivo `.env.local` debe contener:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mpeimoornrbahdpszhor.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZWltb29ybnJiYWhkcHN6aG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MTE0NjAsImV4cCI6MjA3MTA4NzQ2MH0.2-jb88OzA8JRM2fEXd-l6D2QpOyvOPkBefSTt-BRLUU
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Resend Configuration
RESEND_API_KEY=re_dasBV1Zg_AMiUPvNEbckHW61U3hJYK8ZX
RESEND_WEBHOOK_SECRET=webhook_secret_key

# Next.js Configuration
NEXTAUTH_SECRET=tu_nextauth_secret_aqui
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MIPIM Configuration
MIPIM_BASE_URL=https://api.mipim.com
MIPIM_ADMIN_EMAIL=admin@mipim.com

# Email Configuration
DEFAULT_FROM_NAME=MIPIM Team

# Development
NODE_ENV=development
```

## 🏗️ Estructura del Proyecto

```
resend-react/react-email/
├── components/
│   ├── AdminDashboard.tsx      # Dashboard principal
│   ├── EmailTracker.tsx        # Tracking de emails
│   └── WebhookConfig.tsx       # Configuración webhooks
├── pages/
│   ├── api/
│   │   ├── mipim-invitations.ts
│   │   ├── email-tracking.ts
│   │   └── webhooks.ts
│   ├── dashboard.tsx           # Página del dashboard
│   └── login.tsx              # Página de login
├── .env.local                 # Variables de entorno
├── .env.example              # Ejemplo de configuración
└── MIPIM_SYSTEM_README.md    # Esta documentación
```

## 🔐 Sistema de Autenticación

### Roles de Usuario
- **`super_admin`** - Acceso completo al sistema
- **`admin`** - Acceso al dashboard administrativo
- **`user`** - Usuario estándar (sin acceso al dashboard)

### Flujo de Autenticación
1. Los usuarios se registran en `/login`
2. Por defecto reciben rol `user`
3. Un super_admin debe cambiar manualmente el rol a `admin` en Supabase
4. Solo usuarios con rol `admin` o `super_admin` pueden acceder al dashboard

## 📊 Uso del Dashboard

### Acceso al Dashboard
1. Navega a `/login`
2. Inicia sesión con credenciales de administrador
3. Serás redirigido a `/dashboard`

### Funcionalidades del Dashboard

#### 📧 Gestión de Campañas
- Crear nuevas campañas de email
- Seleccionar templates personalizados
- Configurar audiencias objetivo
- Programar envíos
- Monitorear estado de campañas

#### 👥 Gestión de Contactos
- Importar contactos desde CSV
- Crear y editar contactos manualmente
- Segmentar audiencias
- Gestionar listas de distribución

#### 📝 Templates de Email
- Crear templates personalizados
- Editor visual de emails
- Previsualización en tiempo real
- Gestión de variables dinámicas

#### 📈 Tracking y Analytics
- Métricas en tiempo real
- Tasas de apertura y clics
- Seguimiento de bounces y quejas
- Reportes detallados por campaña

#### 🔗 Configuración de Webhooks
- Gestionar endpoints de webhook
- Configurar eventos a trackear
- Monitorear entregas de webhook
- Testing de endpoints

## 🔌 APIs Disponibles

### 1. API de Invitaciones MIPIM
**Endpoint:** `/api/mipim-invitations`

#### Enviar Invitación Individual
```javascript
POST /api/mipim-invitations
{
  "action": "send_invitation",
  "email": "invitado@email.com",
  "name": "Nombre del Invitado",
  "event_details": {
    "name": "MIPIM 2024",
    "date": "2024-03-12",
    "location": "Cannes, Francia"
  }
}
```

#### Envío Masivo
```javascript
POST /api/mipim-invitations
{
  "action": "bulk_send",
  "contacts": [
    { "email": "user1@email.com", "name": "Usuario 1" },
    { "email": "user2@email.com", "name": "Usuario 2" }
  ],
  "template_id": "template_123"
}
```

### 2. API de Tracking
**Endpoint:** `/api/email-tracking`

#### Webhook de Resend (automático)
```javascript
POST /api/email-tracking
{
  "type": "email.delivered",
  "data": {
    "email_id": "email_123",
    "to": "destinatario@email.com",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Consultar Métricas
```javascript
GET /api/email-tracking?campaign_id=123&start_date=2024-01-01&end_date=2024-01-31
```

### 3. API de Webhooks
**Endpoint:** `/api/webhooks`

#### Crear Webhook
```javascript
POST /api/webhooks
{
  "action": "create_webhook",
  "url": "https://tu-dominio.com/webhook",
  "events": ["email.sent", "email.delivered", "email.opened"]
}
```

## 📋 Esquema de Base de Datos

### Tablas Principales

#### `users`
- `id` (UUID, PK)
- `email` (String, único)
- `full_name` (String)
- `role` (Enum: user, admin, super_admin)
- `created_at` (Timestamp)

#### `contacts`
- `id` (UUID, PK)
- `email` (String, único)
- `first_name` (String)
- `last_name` (String)
- `company` (String)
- `tags` (JSON Array)
- `created_at` (Timestamp)

#### `email_campaigns`
- `id` (UUID, PK)
- `name` (String)
- `subject` (String)
- `template_id` (UUID, FK)
- `status` (Enum: draft, scheduled, sending, sent, paused)
- `scheduled_at` (Timestamp)
- `created_by` (UUID, FK)

#### `email_templates`
- `id` (UUID, PK)
- `name` (String)
- `subject` (String)
- `html_content` (Text)
- `variables` (JSON)
- `created_by` (UUID, FK)

#### `email_tracking`
- `id` (UUID, PK)
- `email_id` (String, único)
- `campaign_id` (UUID, FK)
- `recipient_email` (String)
- `status` (Enum: sent, delivered, opened, clicked, bounced, complained)
- `event_data` (JSON)
- `timestamp` (Timestamp)

## 🚀 Despliegue y Configuración

### 1. Configuración de Supabase
1. Crea un proyecto en Supabase
2. Ejecuta las migraciones SQL para crear las tablas
3. Configura las políticas RLS
4. Obtén las claves de API

### 2. Configuración de Resend
1. Crea una cuenta en Resend
2. Obtén tu API key
3. Configura el webhook endpoint: `tu-dominio.com/api/email-tracking`
4. Selecciona los eventos a trackear

### 3. Configuración del Proyecto
1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura variables de entorno
4. Ejecuta migraciones de base de datos
5. Inicia el servidor: `npm run dev`

### 4. Configuración de Producción
1. Despliega en Vercel/Netlify
2. Configura variables de entorno en producción
3. Actualiza URLs de webhook en Resend
4. Configura dominio personalizado

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# Base de datos
npx supabase db reset    # Resetear base de datos
npx supabase db push     # Aplicar migraciones
```

## 🐛 Troubleshooting

### Problemas Comunes

#### Error de Autenticación
- Verificar que las claves de Supabase sean correctas
- Confirmar que el usuario tenga rol `admin` o `super_admin`
- Revisar políticas RLS en Supabase

#### Webhooks No Funcionan
- Verificar que la URL del webhook sea accesible públicamente
- Confirmar configuración en Resend
- Revisar logs de la API en `/api/email-tracking`

#### Emails No Se Envían
- Verificar API key de Resend
- Confirmar que el dominio esté verificado en Resend
- Revisar límites de envío

### Logs y Debugging
- Revisar console del navegador para errores frontend
- Verificar logs de Vercel/servidor para errores backend
- Usar herramientas de desarrollo de Supabase
- Monitorear dashboard de Resend

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema:
1. Revisar esta documentación
2. Verificar logs de error
3. Consultar documentación de Supabase y Resend
4. Contactar al equipo de desarrollo

## 🔄 Próximos Pasos

### Mejoras Sugeridas
- [ ] Implementar notificaciones push
- [ ] Agregar exportación de reportes
- [ ] Integrar con CRM externo
- [ ] Implementar A/B testing
- [ ] Agregar templates de email predefinidos
- [ ] Implementar programación avanzada de campañas

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2024  
**Desarrollado para:** MIPIM Event Management