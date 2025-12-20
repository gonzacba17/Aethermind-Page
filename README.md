# Aethermind Landing Page

Landing page y autenticación para Aethermind AgentOS.

## 📂 Estructura

```
/
├── apps/
│   └── home/          # Landing page (Next.js 16)
│       ├── app/       # Páginas (landing, login, signup, etc.)
│       ├── components/
│       └── public/
├── .nvmrc
├── package.json
└── vercel.json        # Deploy config
```

## 🚀 Funcionalidad

- **Landing page** de marketing
- **Login/Signup** con redirección a dashboard externo
- Páginas estáticas (About, Pricing, Terms, etc.)
- Integración con Stripe para pagos de membresía

### Flujo de Usuario

```
Landing → Login/Signup → Dashboard externo
https://aethermind-page.vercel.app → https://aethermind-agent-os-dashboard.vercel.app
```

## 💻 Desarrollo

### Instalación

```bash
pnpm install
```

### Ejecutar en desarrollo

```bash
pnpm dev
# Abre http://localhost:3001
```

### Build

```bash
pnpm build
pnpm start
```

## 🔧 Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_DASHBOARD_URL=https://aethermind-agent-os-dashboard.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

## 📤 Despliegue en Vercel

1. Conectar el repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Configurar las variables de entorno en Vercel Dashboard
4. Deploy automático en cada push a `main`

## 📝 Notas

- El **dashboard** y **backend API** están en un repositorio separado
- Este repo solo contiene la landing page y formularios de auth
- Después de login exitoso, redirige a: `https://aethermind-agent-os-dashboard.vercel.app`

## 🛠️ Stack Tecnológico

- Next.js 16
- React 18
- TailwindCSS 4
- Radix UI components
- TypeScript
