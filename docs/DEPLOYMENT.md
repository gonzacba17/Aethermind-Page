# 🚀 Guía de Deployment - Aethermind Landing Page

Esta guí te ayudará a desplegar la landing page de Aethermind en diferentes plataformas.

---

## 📋 Tabla de Contenidos

- [Deployment en Vercel (Recomendado)](#deployment-en-vercel)
- [Deployment en Netlify](#deployment-en-netlify)
- [Deployment en Railway](#deployment-en-railway)
- [Deployment Manual (VPS)](#deployment-manual-vps)
- [Variables de Entorno](#variables-de-entorno)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Deployment en Vercel

### Opción 1: GitHub Integration (Recomendado)

1. **Conecta tu repositorio a Vercel**

   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio de GitHub
   - Selecciona el proyecto `Aethermind-Page`

2. **Configuración del Proyecto**

   ```
   Framework Preset: Next.js
   Root Directory: apps/home
   Build Command: npm run build (auto-detectado)
   Output Directory: .next (auto-detectado)
   Install Command: npm install
   ```

3. **Variables de Entorno**

   En Vercel Dashboard → Settings → Environment Variables:

   ```env
   NEXT_PUBLIC_DASHBOARD_URL=https://aethermind-agent-os-dashboard.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. **Deploy**

   - Haz clic en "Deploy"
   - Vercel detectará automáticamente Next.js
   - El sitio estará disponible en `https://tu-proyecto.vercel.app`

5. **Configurar Dominio Custom (Opcional)**
   - Settings → Domains
   - Agrega tu dominio (ej: `aethermind.com`)
   - Configura DNS según instrucciones de Vercel

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy a producción
cd apps/home
vercel --prod
```

### Auto-Deployment

Vercel automáticamente desplegará:

- **Production**: Cada push a branch `main`
- **Preview**: Cada push a otras branches
- **PR Previews**: Para cada Pull Request

---

## 🌐 Deployment en Netlify

### Setup Inicial

1. **Conecta GitHub**

   - Ve a [app.netlify.com/start](https://app.netlify.com/start)
   - Autoriza Netlify en GitHub
   - Selecciona el repositorio

2. **Build Settings**

   ```
   Base directory: apps/home
   Build command: npm run build
   Publish directory: apps/home/.next
   ```

3. **Netlify Config File**

   Crea `netlify.toml` en la raíz:

   ```toml
   [build]
     base = "apps/home"
     command = "npm run build"
     publish = ".next"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "20.9.0"
   ```

4. **Variables de Entorno**
   - Site settings → Environment variables
   - Agrega las mismas vars que en Vercel

---

## 🚂 Deployment en Railway

### Via GitHub

1. **Nuevo Proyecto**

   - Ve a [railway.app/new](https://railway.app/new)
   - Deploy from GitHub repo
   - Selecciona `Aethermind-Page`

2. **Configuración**

   ```bash
   # Railway detectará Next.js automáticamente
   # Root directory: apps/home
   ```

3. **Variables de Entorno**

   - Variables tab
   - Agrega las environment vars necesarias

4. **Custom Domain**
   - Settings → Domains
   - Agrega dominio custom

---

## 🖥️ Deployment Manual (VPS)

### Prerrequisitos

- Ubuntu 20.04+ / Debian 11+
- Node.js 20.9.0+
- Nginx
- PM2 (process manager)

### 1. Preparar Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y
```

### 2. Clonar y Buildear

```bash
# Clonar repo
git clone https://github.com/gonzacba17/Aethermind-Page.git
cd Aethermind-Page/apps/home

# Instalar dependencias
npm install

# Variables de entorno
cp .env.example .env.local
nano .env.local  # Editar valores

# Build de producción
npm run build
```

### 3. Configurar PM2

```bash
# Iniciar con PM2
pm2 start npm --name "aethermind-landing" -- start

# Auto-start on reboot
pm2 startup
pm2 save
```

### 4. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/aethermind
```

```nginx
server {
    listen 80;
    server_name aethermind.com www.aethermind.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/aethermind /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot --nginx -d aethermind.com -d www.aethermind.com
```

---

## 🔐 Variables de Entorno

### Producción

```env
# REQUERIDAS
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.aethermind.com

# OPCIONALES
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://...
```

### Development

```env
# REQUERIDAS
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3000

# OPCIONALES
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Seguridad

⚠️ **Nunca commitees archivos `.env.local` o `.env.production`**

✅ **Siempre usa secretos en plataformas de deployment**

- Vercel: Settings → Environment Variables
- Netlify: Site settings → Environment variables
- Railway: Variables tab

---

## 🐛 Troubleshooting

### Error: "No Next.js version detected"

**Solución**:

```bash
# Verifica que Root Directory esté configurado a apps/home
# En Vercel: Settings → General → Root Directory
```

### Error 404 en todas las páginas

**Solución**:

```bash
# Verifica Output Directory
# Debe ser: .next (no apps/home/.next)
```

### Build falla con errores de TypeScript

**Solución**:

```bash
# Localmente, ejecuta:
cd apps/home
npm run typecheck

# Arregla los errores mostrados
```

### Variables de entorno no funcionan

**Causa**: Variables sin prefijo `NEXT_PUBLIC_` no están disponibles en cliente

**Solución**:

```env
# ❌ Incorrecto
DASHBOARD_URL=https://...

# ✅ Correcto
NEXT_PUBLIC_DASHBOARD_URL=https://...
```

### Performance Issues

**Optimizaciones**:

1. **Habilitar caché de Vercel**

   ```bash
   # vercel.json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=31536000, immutable"
           }
         ]
       }
     ]
   }
   ```

2. **Optimizar imágenes**

   ```bash
   # Usa next/image en lugar de <img>
   import Image from 'next/image'
   ```

3. **Lazy loading**

   ```typescript
   import dynamic from "next/dynamic";

   const HeavyComponent = dynamic(() => import("./HeavyComponent"));
   ```

---

## 📊 Monitoreo Post-Deployment

### Vercel Analytics

Automáticamente habilitado en Vercel. Ve métricas en:

- Dashboard → Analytics
- Web Vitals, Page Views, Top Pages

### Google Analytics

```typescript
// app/layout.tsx ya configurado con
import { GoogleAnalytics } from "@next/third-parties/google";

<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />;
```

### Sentry (Error Tracking)

```bash
# Opcional: Instalar Sentry
npm install @sentry/nextjs

# Configurar en apps/home/instrumentation.ts
```

---

## 🔄 Rollback Strategy

### Vercel

```bash
# Desde Dashboard
Deployments → Selecciona deployment anterior → Promote to Production

# O desde CLI
vercel rollback
```

### Manual (VPS)

```bash
# PM2 rollback
pm2 stop aethermind-landing
git checkout <commit-anterior>
npm run build
pm2 restart aethermind-landing
```

---

## ✅ Checklist Pre-Deployment

- [ ] All tests pass (`npm test`)
- [ ] Build exitoso (`npm run build`)
- [ ] Type-check sin errores (`npm run typecheck`)
- [ ] Lint sin warnings (`npm run lint`)
- [ ] Variables de entorno configuradas
- [ ] DNS apuntando correctamente (si custom domain)
- [ ] SSL configurado
- [ ] Analytics configurado
- [ ] Error tracking configurado

---

## 📞 Soporte

¿Problemas con deployment?

1. Revisa [Troubleshooting](#troubleshooting)
2. Busca en [Issues de GitHub](https://github.com/gonzacba17/Aethermind-Page/issues)
3. Abre nuevo issue con label `deployment`
4. Contacto: contact@aethermind.com

---

**¡Deployment exitoso! 🎉**
