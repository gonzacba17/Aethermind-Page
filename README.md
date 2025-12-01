# Aethermind Monorepo

Monorepo configurado con Turborepo para desplegar en Vercel.

## 📂 Estructura

```
/
├── apps/
│   ├── home/          # Frontend (Landing page + Dashboard)
│   └── api/           # Backend (AgentOS API + WebSockets)
├── packages/
│   ├── core/          # Lógica compartida del core
│   ├── sdk/           # SDK de Aethermind
│   └── dashboard/     # Componentes del dashboard
├── prisma/            # Esquema de base de datos
├── turbo.json         # Configuración de Turborepo
├── pnpm-workspace.yaml
├── vercel.json        # Configuración de despliegue
└── package.json       # Scripts del monorepo
```

## 🚀 Instalación

```bash
pnpm install
```

## 💻 Desarrollo

```bash
# Ejecutar todos los proyectos
pnpm dev

# Solo frontend
pnpm dev:home

# Solo backend
pnpm dev:api

# Solo dashboard
pnpm dev:dashboard
```

## 🏗️ Build

```bash
# Build de todo el monorepo
pnpm build

# Typecheck
pnpm typecheck
```

## 📦 Rutas en Producción

- `/` - Landing page (apps/home)
- `/dashboard` - Dashboard de AgentOS (apps/home/app/dashboard)
- `/api/*` - Backend API (apps/api)

## 🔧 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aethermind"
JWT_SECRET="your-secret-key-here"
PORT=4000
NODE_ENV=production
```

## 📤 Despliegue en Vercel

1. Conectar el repositorio a Vercel
2. Vercel detectará automáticamente:
   - **Frontend**: `apps/home` (Next.js)
   - **Backend**: `apps/api` (Node.js)
3. El `vercel.json` configura el routing:
   - `/api/*` → Backend
   - `/*` → Frontend
4. Configurar las variables de entorno en Vercel Dashboard

## ✅ Configuración Completa

- ✅ Estructura de monorepo
- ✅ Turborepo configurado
- ✅ Frontend en apps/home
- ✅ Backend en apps/api
- ✅ Packages compartidos (core, sdk)
- ✅ Dashboard integrado en /dashboard
- ✅ vercel.json con routing
- ✅ pnpm workspace
- ✅ Scripts de build

## 📝 Notas

- El backend soporta WebSockets
- No se modificó la lógica interna de core, sdk o api
- El frontend consume la API vía rutas relativas `/api/...`
- Compatible con despliegue en Vercel sin cambios adicionales
