# React Email + Resend - Sistema de Envío Masivo

![React Email](https://react.email/static/covers/react-email.png)

<div align="center"><strong>Sistema de Envío Masivo de Emails</strong></div>
<div align="center">Plataforma completa para crear y enviar emails masivos usando React Email y Resend API.<br />Incluye editor visual, templates personalizados y API REST.</div>
<br />
<div align="center">
<a href="https://aliest.growthbdm.com">Demo en Vivo</a>
<span> · </span>
<a href="https://github.com/resend/react-email">React Email</a>
<span> · </span>
<a href="https://resend.com">Resend</a>
</div>

## 🚀 Características

- **Editor Visual**: Interfaz web para crear y editar templates de email
- **Templates Personalizados**: Biblioteca de templates responsive con React
- **Envío Masivo**: API REST para enviar emails a listas de destinatarios
- **Resend Integration**: Integración completa con Resend API
- **Dark Mode**: Soporte para modo oscuro en emails
- **Responsive Design**: Templates optimizados para todos los dispositivos
- **Rate Limiting**: Control de límites de envío para evitar spam
- **Error Handling**: Manejo robusto de errores y reintentos

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Email Engine**: React Email
- **Email Service**: Resend API
- **Styling**: Tailwind CSS, Radix UI
- **Deployment**: Vercel

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd resend-react/react-email
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
RESEND_API_KEY=tu_api_key_de_resend
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

4. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

5. Abre [http://localhost:3001](http://localhost:3001) en tu navegador

## 🎯 Uso

### Editor Visual
Accede a `http://localhost:3001` para usar el editor visual de templates.

### API REST para Envío Masivo

**Endpoint**: `POST /api/send/bulk`

**Payload**:
```json
{
  "recipients": [
    {
      "email": "usuario@ejemplo.com",
      "name": "Nombre Usuario"
    }
  ],
  "template": "marketing-campaign",
  "subject": "Asunto del Email",
  "variables": {
    "companyName": "Tu Empresa",
    "productName": "Tu Producto"
  }
}
```

### Crear Templates Personalizados

1. Crea un nuevo archivo en `templates/`:
```tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

interface Props {
  name?: string;
  companyName?: string;
}

export default function MiTemplate({ name = 'Usuario', companyName = 'Mi Empresa' }: Props) {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Text>Hola {name},</Text>
          <Text>Bienvenido a {companyName}</Text>
          <Button href="https://ejemplo.com">Comenzar</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

## 🚀 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel:
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
3. Deploy automático en cada push

### Variables de Entorno de Producción

```env
RESEND_API_KEY=tu_api_key_de_resend
NEXT_PUBLIC_APP_URL=https://aliest.growthbdm.com
```

## 📁 Estructura del Proyecto

```
react-email/
├── apps/web/                 # Aplicación web principal
│   ├── src/
│   │   ├── app/             # App Router de Next.js
│   │   ├── components/      # Componentes React
│   │   └── styles/          # Estilos globales
│   └── package.json
├── templates/               # Templates de email personalizados
├── lib/                     # Utilidades y helpers
├── api/                     # Endpoints de API
└── examples/                # Ejemplos de uso
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE.md` para más detalles.

## 🆘 Soporte

- [Documentación de React Email](https://react.email/docs)
- [Documentación de Resend](https://resend.com/docs)
- [Issues de GitHub](https://github.com/tu-usuario/tu-repo/issues)

---

<div align="center">
  Hecho con ❤️ usando React Email y Resend
</div>
