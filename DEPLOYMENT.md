# 🚀 Guía de Deployment en Vercel

## Preparación del Proyecto

### 1. Subir a GitHub

```bash
# Si no tienes un repositorio remoto configurado
git remote add origin https://github.com/tu-usuario/resend-react-email.git

# Subir los cambios
git push -u origin canary
```

### 2. Configurar Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### 3. Variables de Entorno en Vercel

Configura estas variables en el dashboard de Vercel:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://resend.growthbdm.com
```

**Pasos:**
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable:
   - Name: `RESEND_API_KEY`
   - Value: Tu API key de Resend
   - Environments: Production, Preview, Development

### 4. Configurar Dominio Personalizado

1. En tu proyecto de Vercel, ve a Settings → Domains
2. Agrega el dominio: `resend.growthbdm.com`
3. Configura los DNS en tu proveedor de dominio:

```
Tipo: CNAME
Nombre: resend
Valor: cname.vercel-dns.com
```

### 5. Deployment Automático

Una vez configurado, cada push a la rama `canary` desplegará automáticamente.

## Verificación Post-Deployment

### ✅ Checklist

- [ ] El sitio carga en `https://resend.growthbdm.com`
- [ ] Los templates se muestran correctamente
- [ ] La API `/api/send/bulk` responde
- [ ] Las variables de entorno están configuradas
- [ ] Los emails se envían correctamente

### 🧪 Pruebas

1. **Probar la interfaz web:**
   ```
   https://resend.growthbdm.com
   ```

2. **Probar la API de envío masivo:**
   ```bash
   curl -X POST https://resend.growthbdm.com/api/send/bulk \
     -H "Content-Type: application/json" \
     -d '{
       "recipients": [
         {
           "email": "test@ejemplo.com",
           "name": "Usuario Test"
         }
       ],
       "template": "marketing-campaign",
       "subject": "Test desde producción",
       "variables": {
         "companyName": "Growth BDM",
         "productName": "Resend Platform"
       }
     }'
   ```

## Troubleshooting

### Error: Build Failed
- Verifica que el `Root Directory` esté configurado como `apps/web`
- Asegúrate de que todas las dependencias estén en `package.json`

### Error: API Routes No Funcionan
- Verifica que las variables de entorno estén configuradas
- Revisa los logs en Vercel Dashboard → Functions

### Error: Dominio No Resuelve
- Verifica la configuración DNS
- Puede tomar hasta 24 horas en propagarse

## Comandos Útiles

```bash
# Verificar el build localmente
pnpm build

# Instalar Vercel CLI
npm i -g vercel

# Deploy desde CLI
vercel --prod

# Ver logs en tiempo real
vercel logs
```

## Monitoreo

- **Dashboard de Vercel**: Métricas de performance y errores
- **Resend Dashboard**: Estadísticas de envío de emails
- **Logs**: Vercel Functions logs para debugging

---

¡Tu plataforma de envío masivo de emails estará lista en producción! 🎉