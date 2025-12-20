# 🚀 Configuración de Vercel - Instrucciones

## Problema Actual

Vercel no encuentra Next.js porque el proyecto está en `apps/home/` pero busca en la raíz.

## ✅ Solución: Configurar Root Directory en Vercel

### Pasos en el Dashboard de Vercel:

1. **Ir a tu proyecto** en Vercel Dashboard

   - https://vercel.com/gonzacba17/aethermind-page

2. **Settings → General**

3. **Scroll hasta "Root Directory"**

4. **Hacer clic en "Edit"**

5. **Seleccionar o escribir**: `apps/home`

6. **Guardar cambios**

7. **Volver a deployar**:
   - Ve a "Deployments"
   - Haz clic en los 3 puntos del último deployment
   - "Redeploy"

## 📋 Configuración Completa de Vercel

Si te pide más configuración, usa estos valores:

```
Framework Preset: Next.js
Root Directory: apps/home
Build Command: npm run build (autodetectado)
Output Directory: .next (autodetectado)
Install Command: npm install (autodetectado)
```

## 🔍 Verificar que funcione

Después del redeploy, deberías ver:

```
✓ Detected Next.js version
✓ Installing dependencies
✓ Building Next.js application
✓ Deployment ready
```

## 💡 Alternativa (si no funciona)

Si prefieres no cambiar el Root Directory, puedes mover todo de `apps/home/` a la raíz:

```bash
# En local
mv apps/home/* ./
mv apps/home/.* ./ 2>/dev/null
rm -rf apps/
```

Pero la solución recomendada es **configurar Root Directory = apps/home** en Vercel.
