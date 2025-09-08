# Instrucciones de Plantillas MIPIM

## 📧 Plantilla Oficial MIPIM

### ✅ Plantilla Correcta: **MIPIM v3**

**Archivo:** `send-mipim-v3.js`  
**Ubicación:** `/react-email/send-mipim-v3.js`  
**Estado:** ✅ **ACTIVA Y APROBADA**

#### Características de la Plantilla v3:
- **Diseño moderno** con branding profesional
- **Logos integrados**: Aliest Growth y MIPIM
- **Información completa del evento**:
  - Fecha: 10 de Septiembre 2025
  - Hora: 8:30 a.m.
  - Ubicación: Neuchatel, Ciudad de México
- **Sección de ponentes destacados** con speakers específicos
- **CTA prominente** para confirmación de asistencia
- **Diseño responsive** y profesional
- **Branding GrowthBDM** consistente

#### Asunto del Correo:
```
Promoción MIPIM - La Feria de Real Estate más Grande del Mundo
```

#### Remitente:
```
GrowthBDM <onboarding@resend.dev>
```

---

## ❌ Plantillas Obsoletas (NO USAR)

### 🗑️ Para Eliminar:

1. **MIPIM v1** - `mipim-invitation.tsx`
   - Ubicación: `/apps/web/src/emails/invitations/mipim-invitation.tsx`
   - Estado: ❌ OBSOLETA

2. **MIPIM v2** - `mipim-invitation-v2.tsx`
   - Ubicación: `/apps/web/src/emails/invitations/mipim-invitation-v2.tsx`
   - Estado: ❌ OBSOLETA

---

## 🔧 Configuración Técnica

### Variables de Entorno Requeridas:
```env
RESEND_API_KEY=tu_api_key_aqui
```

### Comando de Envío:
```bash
node send-mipim-v3.js
```

### Dependencias:
- `resend` - Para envío de correos
- `dotenv` - Para variables de entorno

---

## 📋 Checklist de Uso

Antes de enviar correos MIPIM, verificar:

- [ ] Usar únicamente `send-mipim-v3.js`
- [ ] Verificar que las imágenes/logos cargan correctamente
- [ ] Confirmar que el botón CTA tiene el enlace correcto
- [ ] Revisar destinatarios en el script
- [ ] Verificar variables de entorno configuradas
- [ ] Probar envío a correo de prueba primero

---

## 🚨 Notas Importantes

1. **Solo usar plantilla v3**: Las versiones anteriores están desactualizadas
2. **Verificar imágenes**: Los logos deben cargar desde Supabase correctamente
3. **Revisar enlaces**: El botón CTA debe dirigir al enlace correcto
4. **Mantener branding**: Conservar el diseño y colores de GrowthBDM

---

## 📞 Contacto

Para dudas sobre las plantillas MIPIM:
- **Email**: info@growthbdm.com
- **Web**: www.growthbdm.com

---

**Última actualización**: Enero 2025  
**Versión del documento**: 1.0  
**Responsable**: Equipo GrowthBDM