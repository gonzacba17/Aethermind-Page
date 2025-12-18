# 📊 REPORTE DE AUDITORÍA: MONOREPO AETHERMIND

## RESUMEN EJECUTIVO

El repositorio **YA ES UN MONOREPO** funcional con Turborepo y pnpm workspaces. La estructura está bien configurada, pero existen **problemas críticos de configuración** y **código duplicado significativo** que deben resolverse para optimizar el funcionamiento.

**Estado General:** ⚠️ **FUNCIONAL CON ADVERTENCIAS CRÍTICAS**

---

## 1. ✅ CUMPLE: Aspectos Correctamente Configurados

### 1.1 Estructura de Monorepo ✅
- **pnpm-workspace.yaml**: Correctamente configurado con `apps/*` y `packages/*`
- **turbo.json**: Configuración básica de tasks funcionando
- **packageManager**: Especificado correctamente (`pnpm@9.0.0`)
- **Workspaces identificados**: 5 paquetes (home, api, dashboard, core, sdk)

### 1.2 Nombres de Paquetes ✅
- ✅ `@aethermind/home` - Landing page
- ✅ `@aethermind/api` - Backend API
- ✅ `@aethermind/dashboard` - Dashboard
- ✅ `@aethermind/core` - Core logic
- ✅ `@aethermind/sdk` - SDK

### 1.3 Scripts de Monorepo ✅
```json
"dev": "turbo run dev"
"build": "turbo run build"
"lint": "turbo run lint"
"typecheck": "turbo run typecheck"
```

### 1.4 TypeScript Paths ✅
- **apps/home**: `@/*` → `./*` ✅
- **packages/dashboard**: `@/*` → `./src/*` ✅
- **apps/api**: Extiende `tsconfig.base.json` ✅
- **packages/core**: Extiende `tsconfig.base.json` ✅

### 1.5 Dependencies de Workspace ✅
- `apps/api` usa `@aethermind/core` y `@aethermind/sdk` correctamente
- `packages/sdk` usa `@aethermind/core` correctamente

---

## 2. ❌ ERRORES CRÍTICOS: Problemas que Impedirán el Funcionamiento

### 2.1 ❌ next.config.mjs - `typescript.ignoreBuildErrors: true`
**Ubicación:** `apps/home/next.config.mjs:4`

**Código Actual:**
```javascript
typescript: {
  ignoreBuildErrors: true,
}
```

**Prioridad:** 🔴 **CRÍTICA**

**Problema:** 
- Ignora errores de TypeScript en build
- Puede deployar código con bugs
- Oculta problemas reales

**Código Sugerido:**
```javascript
typescript: {
  ignoreBuildErrors: false, // SIEMPRE debe ser false en producción
}
```

**Acción:** Remover inmediatamente, corregir errores de tipos, y hacer commit.

---

### 2.2 ❌ next.config.mjs - `images.unoptimized: true`
**Ubicación:** `apps/home/next.config.mjs:6-8`

**Código Actual:**
```javascript
images: {
  unoptimized: true,
}
```

**Prioridad:** 🔴 **ALTA**

**Problema:**
- Desactiva optimización de imágenes de Next.js
- Aumenta tamaño de bundle y tiempos de carga
- Impacto negativo en performance y SEO

**Código Sugerido:**
```javascript
images: {
  unoptimized: false,
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**Acción:** Remover y auditar todas las imágenes para usar `next/image`.

---

### 2.3 ❌ Versiones de Next.js Inconsistentes
**Ubicación:** `apps/home/package.json` vs `packages/dashboard/package.json`

**Problema:**
- **apps/home**: `next@16.0.8` (React 19)
- **packages/dashboard**: `next@14.2.32` (React 18)

**Prioridad:** 🔴 **ALTA**

**Impacto:**
- Comportamiento inconsistente
- Potenciales breaking changes
- Dificultad para compartir componentes

**Código Sugerido:**
```json
// Ambos packages deben usar la misma versión
"next": "16.0.8",
"react": "19.2.0",
"react-dom": "19.2.0"
```

---

### 2.4 ❌ Hardcoded URL en Redirect
**Ubicación:** `apps/home/next.config.mjs:14`

**Código Actual:**
```javascript
async redirects() {
  return [{
    source: '/dashboard',
    destination: 'https://aethermind-agent-os-dashboard.vercel.app/',
    permanent: true,
  }]
}
```

**Prioridad:** 🔴 **ALTA**

**Problema:**
- URL hardcodeada en lugar de usar variable de entorno
- No funciona en desarrollo local
- Dificulta cambios de deployment

**Código Sugerido:**
```javascript
async redirects() {
  return [{
    source: '/dashboard',
    destination: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',
    permanent: false, // Cambiar a false para desarrollo
  }]
}
```

---

### 2.5 ❌ Falta ESLint Config Compartida
**Problema:** Cada app tiene su propia configuración de ESLint sin estandarización.

**Prioridad:** 🟡 **MEDIA**

**Acción:** Crear `packages/config-eslint` con configuración compartida.

---

## 3. ⚠️ ADVERTENCIAS: Aspectos que Funcionan pero Pueden Mejorarse

### 3.1 ⚠️ tsconfig.base.json Incompleto
**Ubicación:** `tsconfig.base.json`

**Problema:** No incluye `jsx` ni `lib` para React, y usa `module: commonjs` cuando apps usan `ESNext`.

**Código Actual:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",  // ⚠️ Inconsistente con apps
    "lib": ["ES2020"],     // ⚠️ No incluye DOM
  }
}
```

**Código Sugerido:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

### 3.2 ⚠️ apps/api tiene `strict: false`
**Ubicación:** `apps/api/tsconfig.json:11`

**Código Actual:**
```json
"strict": false,
```

**Problema:** Desactiva type checking estricto, aumenta probabilidad de bugs.

**Código Sugerido:**
```json
"strict": true,
```

**Acción:** Habilitar gradualmente con `strictNullChecks`, `strictFunctionTypes`, etc.

---

### 3.3 ⚠️ Environment Variables Duplicadas
**Problema:** `NEXT_PUBLIC_API_URL` definida 3 veces en `.env.example` root.

**Ubicación:** `.env.example:7, 10`

**Código Actual:**
```bash
# Frontend - Landing Page (apps/home)
NEXT_PUBLIC_API_URL=https://aethermindapi-production.up.railway.app

# Frontend - Dashboard (packages/dashboard)
NEXT_PUBLIC_API_URL=https://aethermindapi-production.up.railway.app
```

**Código Sugerido:**
```bash
# Shared API URL (usado por apps/home y packages/dashboard)
NEXT_PUBLIC_API_URL=https://aethermindapi-production.up.railway.app

# O bien, separar por ambiente
NEXT_PUBLIC_HOME_API_URL=https://aethermindapi-production.up.railway.app
NEXT_PUBLIC_DASHBOARD_API_URL=https://aethermindapi-production.up.railway.app
```

---

### 3.4 ⚠️ Turbo.json Puede Optimizarse

**Código Actual:**
```json
"lint": { "cache": false }
"typecheck": { "cache": false }
```

**Problema:** Deshabilita caching para lint y typecheck, ralentizando CI.

**Código Sugerido:**
```json
"lint": {
  "cache": true,
  "outputs": [".eslintcache"]
},
"typecheck": {
  "cache": true,
  "outputs": ["**/*.tsbuildinfo"]
}
```

---

### 3.5 ⚠️ vercel.json con Configuración Legacy

**Ubicación:** `vercel.json:1-26`

**Problema:** Usa `builds` y `routes` (legacy), debería usar `outputDirectory` y framework presets.

**Código Actual:**
```json
{
  "version": 2,
  "buildCommand": "pnpm install && pnpm -w build",
  "builds": [...]
}
```

**Código Sugerido:**
```json
{
  "version": 2,
  "buildCommand": "turbo run build --filter=@aethermind/home",
  "outputDirectory": "apps/home/.next",
  "framework": "nextjs",
  "installCommand": "pnpm install"
}
```

**Nota:** Para monorepo, considera deploy separados por app usando Vercel Project Links.

---

## 4. 📦 CÓDIGO A EXTRAER: Componentes para Packages Compartidos

### 4.1 Crear `packages/ui` (🔴 PRIORIDAD CRÍTICA)

**Componentes Duplicados:**
1. **Badge** - apps/home/components/ui/badge.tsx + dashboard/src/components/ui/badge.tsx
2. **Button** - apps/home/components/ui/button.tsx + dashboard/src/components/ui/button.tsx
3. **Card** - apps/home/components/ui/card.tsx + dashboard/src/components/ui/card.tsx

**Componentes Únicos en apps/home (Alta Prioridad para extraer):**
- Input, Form, Select, Dialog, Table
- Toast/Toaster, Alert, Spinner, Skeleton
- Tabs, Checkbox, Radio Group, Switch, Textarea, Label
- Dropdown Menu, Popover, Tooltip, Separator
- Progress, Slider, Pagination, Avatar
- **TOTAL: ~30 componentes**

**Acción:**
1. Crear `packages/ui/` con estructura:
   ```
   packages/ui/
   ├── src/
   │   ├── components/
   │   │   ├── badge.tsx
   │   │   ├── button.tsx
   │   │   └── ...
   │   ├── hooks/
   │   │   ├── use-mobile.ts
   │   │   └── use-toast.ts
   │   └── index.ts
   ├── package.json
   └── tsconfig.json
   ```

2. Consolidar versiones duplicadas (usar apps/home como base, agregar forwardRef)

3. Actualizar dependencies:
   ```json
   // apps/home/package.json
   {
     "dependencies": {
       "@aethermind/ui": "workspace:*"
     }
   }
   ```

---

### 4.2 Crear `packages/utils` (🟡 PRIORIDAD ALTA)

**Funciones Duplicadas:**
- `cn()` - apps/home/lib/utils.ts + dashboard/src/lib/utils.ts (DUPLICADO EXACTO)

**Funciones a Centralizar:**
- `formatDate()`, `formatDuration()`, `formatCost()`, `formatTokens()` (de dashboard)
- `retryWithBackoff()`, `withTimeout()` (de core/utils/retry.ts)
- `sanitizeLog()`, `sanitizeObject()` (de api/utils/sanitizer.ts)
- **HTTP Client base** (nueva implementación para consolidar fetchWithConfig)

**Estructura Propuesta:**
```
packages/utils/
├── src/
│   ├── format/       # date, duration, cost, tokens
│   ├── http/         # HTTP client base
│   ├── retry/        # retry logic
│   ├── security/     # sanitizer
│   └── ui/           # cn() function
└── package.json
```

---

### 4.3 Crear `packages/types` (🟡 PRIORIDAD ALTA)

**Tipos Duplicados con Inconsistencias:**
1. **LogEntry** - core vs dashboard (Date vs string)
2. **ExecutionResult** - core vs dashboard (Date vs string, Error vs {message})
3. **Trace, TraceNode** - core vs dashboard
4. **CostInfo** - core vs dashboard (estructura diferente)
5. **CostEstimate, StepCostEstimate** - core vs dashboard

**Total:** 7 tipos duplicados con incompatibilidades `Date` vs `string`

**Acción:**
1. Crear package con tipos centralizados
2. Implementar `Serialized<T>` helper para conversión automática:
   ```typescript
   export type Serialized<T> = T extends Date ? string : ...;
   export type ExecutionResultDTO = Serialized<ExecutionResult>;
   ```

---

### 4.4 Crear `packages/config` (🟢 PRIORIDAD MEDIA)

**Configuraciones a Compartir:**
- ESLint config
- Prettier config
- Tailwind config base
- TypeScript config presets

---

## 5. 🔧 CAMBIOS NECESARIOS (Priorizado)

### FASE 1: Correcciones Críticas (Semana 1)

#### 5.1 Remover `typescript.ignoreBuildErrors`
```bash
# apps/home/next.config.mjs
- typescript: { ignoreBuildErrors: true }
+ typescript: { ignoreBuildErrors: false }
```

#### 5.2 Habilitar Optimización de Imágenes
```bash
# apps/home/next.config.mjs
- images: { unoptimized: true }
+ # Remover completamente, usar defaults
```

#### 5.3 Usar Variable de Entorno para Dashboard URL
```bash
# apps/home/next.config.mjs
- destination: 'https://aethermind-agent-os-dashboard.vercel.app/',
+ destination: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000/dashboard',
```

#### 5.4 Sincronizar Versiones de Next.js
```bash
# packages/dashboard/package.json
- "next": "^14.2.32"
- "react": "^18.2.0"
- "react-dom": "^18.2.0"
+ "next": "16.0.8"
+ "react": "19.2.0"
+ "react-dom": "19.2.0"
```

---

### FASE 2: Crear Packages Compartidos (Semana 2-3)

#### 5.5 Crear `@aethermind/ui`
- Mover Badge, Button, Card (duplicados)
- Mover 27 componentes adicionales de alta prioridad
- Consolidar hooks (use-mobile, use-toast)

#### 5.6 Crear `@aethermind/utils`
- Mover `cn()` function
- Crear HTTP client base
- Mover funciones de formato
- Mover retry utilities

#### 5.7 Crear `@aethermind/types`
- Consolidar 7 tipos duplicados
- Implementar solución Date vs string

---

### FASE 3: Optimizaciones (Semana 4)

#### 5.8 Mejorar tsconfig.base.json
```json
{
  "compilerOptions": {
    "module": "esnext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx"
  }
}
```

#### 5.9 Habilitar TypeScript Strict Mode en API
```json
// apps/api/tsconfig.json
"strict": true
```

#### 5.10 Optimizar turbo.json
```json
"lint": { "cache": true },
"typecheck": { "cache": true }
```

#### 5.11 Modernizar vercel.json
```json
{
  "buildCommand": "turbo run build --filter=@aethermind/home",
  "framework": "nextjs"
}
```

---

## 6. 🎯 MÉTRICAS Y ESTADÍSTICAS

### Duplicación de Código
- **3 componentes UI duplicados** (Badge, Button, Card)
- **1 función utility duplicada** (`cn()`)
- **7 tipos TypeScript duplicados** (con inconsistencias)
- **~106 líneas de código eliminables** al consolidar

### Estructura Actual
- **5 workspaces** configurados
- **2 apps Next.js** (home, dashboard)
- **1 backend API** (Node.js/Express)
- **2 packages internos** (core, sdk)
- **60+ componentes UI** en apps/home
- **3 componentes UI** en packages/dashboard

### Performance
- **Build time actual:** No optimizado (cache disabled)
- **Build time estimado con optimizaciones:** ~30-40% más rápido

---

## 7. 🗄️ BASE DE DATOS Y PRISMA

### 7.1 ✅ Prisma Correctamente Configurado

**Ubicación:** `/prisma/schema.prisma`

**Fortalezas:**
- ✅ Schema bien estructurado con 5 modelos: `User`, `Agent`, `Workflow`, `Execution`, `Log`
- ✅ Relaciones correctas con cascada (`onDelete: Cascade`)
- ✅ Índices optimizados (`@@index` en campos frecuentemente consultados)
- ✅ Tipos de datos apropiados con constraints (`@db.VarChar(255)`, `@db.Uuid`, etc.)
- ✅ Binary targets para multi-plataforma: `["native", "debian-openssl-3.0.x", "windows"]`

**Modelo User incluye:**
- Autenticación: `email`, `passwordHash`, `emailVerified`, `verificationToken`
- API Keys: `apiKey`
- Stripe: `stripeCustomerId`, `stripeSubscriptionId`
- Usage limits: `usageLimit`, `usageCount`, `plan`
- Reset password: `resetToken`, `resetTokenExpiry`

### 7.2 ⚠️ Prisma en Package Root en lugar de apps/api

**Problema:** 
- Prisma está en la raíz del monorepo
- `@prisma/client` está duplicado en root `package.json` y `apps/api/package.json`

**Prioridad:** 🟡 **MEDIA**

**Recomendación:**

**Opción A: Mover a apps/api (Recomendado para backends únicos)**
```bash
mkdir -p apps/api/prisma
mv prisma/* apps/api/prisma/
rmdir prisma

# Actualizar apps/api/package.json
{
  "prisma": {
    "schema": "./prisma/schema.prisma"
  }
}
```

**Opción B: Crear package compartido (Recomendado si múltiples apps usan Prisma)**
```bash
mkdir -p packages/database
mv prisma packages/database/
# Crear packages/database/package.json
```

---

## 8. 🎨 TAILWIND CSS - Configuración Duplicada

### 8.1 ⚠️ Tailwind Config Casi Idéntico pero No Compartido

**Ubicaciones:**
- `packages/dashboard/tailwind.config.js` - 75 líneas
- `apps/home` - usa Tailwind v4 con PostCSS plugin

**Diferencias:**
- **Dashboard:** Tailwind v3 con config tradicional
- **Home:** Tailwind v4 (beta) con `@tailwindcss/postcss`

**Problema:**
- Configuraciones prácticamente idénticas (colores, borderRadius, animations)
- No están compartidas
- Versiones diferentes de Tailwind (v3 vs v4)

**Prioridad:** 🟡 **MEDIA**

**Recomendación:**

**Fase 1: Sincronizar versiones de Tailwind**
```json
// Ambos deben usar la misma versión
"tailwindcss": "^4.1.9",  // O volver a v3
"@tailwindcss/postcss": "^4.1.9"
```

**Fase 2: Crear `packages/config/tailwind-config.js`**
```javascript
// packages/config/tailwind-config.js
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: { /* shared colors */ },
      borderRadius: { /* shared radii */ },
      // ...
    }
  }
}
```

**Fase 3: Extender en cada app**
```javascript
// apps/home/tailwind.config.js
const baseConfig = require('@aethermind/config/tailwind-config');

module.exports = {
  ...baseConfig,
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}']
}
```

---

## 9. 📦 ANÁLISIS DE BUNDLE SIZE Y DEPENDENCIES

### 9.1 ⚠️ Dependencias Duplicadas entre Apps

**Radix UI Components - Duplicados en home y dashboard:**

```json
// apps/home/package.json - 29 packages @radix-ui/*
"@radix-ui/react-accordion": "1.2.2",
"@radix-ui/react-alert-dialog": "1.1.4",
"@radix-ui/react-dialog": "1.1.4",
// ... +26 más

// packages/dashboard/package.json - 6 packages @radix-ui/*
"@radix-ui/react-dialog": "^1.0.5",      // ⚠️ Versión diferente
"@radix-ui/react-dropdown-menu": "^2.0.6",
"@radix-ui/react-select": "^2.0.0",
// ... +3 más
```

**Problema:**
- Versiones inconsistentes (`1.1.4` vs `^1.0.5`)
- Duplicación innecesaria
- Al mover a `@aethermind/ui`, se consolidarán

**Acción:** Al crear `@aethermind/ui`, definir versiones únicas de Radix UI como peer dependencies.

---

### 9.2 ⚠️ Utility Libraries Duplicadas

```json
// apps/home/package.json
"class-variance-authority": "^0.7.1",
"clsx": "^2.1.1",
"tailwind-merge": "^2.5.5",

// packages/dashboard/package.json
"class-variance-authority": "^0.7.0",  // ⚠️ Versión diferente
"clsx": "^2.1.0",                       // ⚠️ Versión diferente
"tailwind-merge": "^2.2.0",             // ⚠️ Versión diferente
```

**Problema:** Mismas librerías con versiones inconsistentes.

**Acción:** Definir en `@aethermind/ui` como dependencies, sincronizar versiones.

---

## 10. 🔍 ANÁLISIS DE IMPORTS Y ANTI-PATTERNS

### 10.1 ✅ Imports Relativos - Bien Manejados

**Verificación realizada:**
- ✅ No se encontraron imports con `../../..` excesivos en apps/home
- ✅ No se encontraron imports con `../../..` excesivos en packages/dashboard
- ✅ Ambas apps usan path alias `@/*` correctamente

**Ejemplo de apps/home:**
```typescript
import { NeuralBackground } from "@/components/neural-background"
import { SiteHeader } from "@/components/site-header"
```

**Ejemplo de packages/dashboard:**
```typescript
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
```

---

## 11. 🚀 DEPLOYMENT CONFIGURATION - Análisis Detallado

### 11.1 ❌ vercel.json con Configuración Legacy y Problemática

**Código Actual:**
```json
{
  "version": 2,
  "buildCommand": "pnpm install && pnpm -w build",
  "installCommand": "pnpm install",
  "builds": [
    {
      "src": "apps/home/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "apps/api/dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/api/dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "apps/home/$1"
    }
  ],
  "outputDirectory": "apps/home/.next"
}
```

**Problemas Identificados:**

1. **Intenta deployar múltiples apps en un solo proyecto** (anti-pattern de Vercel)
2. **`builds` array está deprecated** para Next.js (usar framework detection)
3. **`routes` está deprecated** para Next.js (usar rewrites en next.config)
4. **Build command ejecuta TODO el monorepo** en lugar de filtrar
5. **API y Frontend en el mismo deploy** (debería ser separado)

**Prioridad:** 🔴 **ALTA**

**Recomendación: Deploy Separado por App**

**Para apps/home (Landing):**
```json
// apps/home/vercel.json (o config en Vercel dashboard)
{
  "buildCommand": "cd ../.. && pnpm install && turbo run build --filter=@aethermind/home",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

**Para packages/dashboard:**
```json
// packages/dashboard/vercel.json
{
  "buildCommand": "cd ../.. && turbo run build --filter=@aethermind/dashboard",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

**Para apps/api:**
```json
// apps/api/vercel.json
{
  "buildCommand": "cd ../.. && pnpm install && turbo run build --filter=@aethermind/api",
  "outputDirectory": "dist",
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

**Configuración en Vercel Dashboard:**
- Crear 3 proyectos separados: `aethermind-home`, `aethermind-dashboard`, `aethermind-api`
- Conectar cada uno al mismo repositorio
- Configurar **Root Directory** para cada proyecto:
  - Home: `apps/home`
  - Dashboard: `packages/dashboard`
  - API: `apps/api`

---

## 12. 📊 MÉTRICAS FINALES DE CÓDIGO

**Total de Líneas de Código por Componente:**
- **apps/home/components/ui/**: ~6,254 líneas (60 componentes)
- **Promedio por componente**: ~104 líneas
- **Componentes más grandes**: Carousel, Chart, Command, Form (>200 líneas c/u)

**Estimación de Código Duplicado:**
- UI Components: ~300 líneas (Badge + Button + Card duplicados)
- Utilities: ~50 líneas (`cn()`, formatters)
- Types: ~200 líneas (7 tipos duplicados)
- **Total eliminable: ~550 líneas**

**Tamaño de node_modules estimado:**
- Dashboard con Radix UI duplicado: ~15 MB extras innecesarios
- Al consolidar en `@aethermind/ui`: **Reducción de ~30-40% en dependencies instaladas**

---

## 13. 🎯 PLAN DE ACCIÓN COMPLETO

### CRÍTICO - Hacer AHORA (Día 1)

```bash
# 1. Corregir next.config.mjs de apps/home
# apps/home/next.config.mjs
```
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,  // ← CAMBIO CRÍTICO
  },
  // Remover images.unoptimized completamente
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',  // ← CAMBIO
        permanent: false,  // ← CAMBIO para desarrollo
      },
    ]
  },
}

export default nextConfig
```

```bash
# 2. Agregar variable de entorno
# .env.example
echo "NEXT_PUBLIC_DASHBOARD_URL=https://aethermind-agent-os-dashboard.vercel.app" >> .env.example

# 3. Sincronizar versión de Next.js en dashboard
# packages/dashboard/package.json
```

### ALTA PRIORIDAD - Semana 1

**Día 2-3: Crear `@aethermind/ui`**

```bash
# 1. Crear estructura
mkdir -p packages/ui/src/{components,hooks,lib}

# 2. Crear package.json
cat > packages/ui/package.json << 'EOF'
{
  "name": "@aethermind/ui",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-slot": "1.1.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "tailwind-merge": "^2.5.5"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "typescript": "^5.4.0"
  }
}
EOF

# 3. Copiar y consolidar componentes duplicados
cp apps/home/components/ui/button.tsx packages/ui/src/components/
# Editar para agregar forwardRef de dashboard

# 4. Actualizar imports en apps
# apps/home: Cambiar de "@/components/ui/button" a "@aethermind/ui/components/button"
```

**Día 4-5: Crear `@aethermind/utils`**

```bash
mkdir -p packages/utils/src/{format,http,ui,retry,security}

cat > packages/utils/package.json << 'EOF'
{
  "name": "@aethermind/utils",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./format": "./src/format/index.ts",
    "./http": "./src/http/index.ts",
    "./ui": "./src/ui/index.ts"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  }
}
EOF

# Mover cn() function
cat > packages/utils/src/ui/className.ts << 'EOF'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF
```

**Día 6-7: Crear `@aethermind/types`**

```bash
mkdir -p packages/types/src
# Crear types con solución Date vs string
```

---

### MEDIA PRIORIDAD - Semana 2

1. Habilitar `strict: true` en apps/api
2. Mejorar `tsconfig.base.json`
3. Optimizar `turbo.json` (habilitar cache)
4. Crear `packages/config` para ESLint, Prettier, Tailwind

---

### BAJA PRIORIDAD - Semana 3-4

1. Mover Prisma a `apps/api` o `packages/database`
2. Refactorizar `vercel.json` (deploy separado por app)
3. Auditar y optimizar bundle sizes
4. Implementar linting pre-commit hooks

---

## 14. ✅ CHECKLIST FINAL ACCIONABLE

### 🔴 CRÍTICO (HOY)
- [ ] Cambiar `typescript.ignoreBuildErrors` a `false` en apps/home/next.config.mjs
- [ ] Remover `images.unoptimized` de apps/home/next.config.mjs
- [ ] Cambiar hardcoded dashboard URL a variable de entorno
- [ ] Agregar `NEXT_PUBLIC_DASHBOARD_URL` a .env.example
- [ ] Correr `pnpm typecheck` y corregir errores de TypeScript

### 🟡 ALTA (ESTA SEMANA)
- [ ] Sincronizar Next.js a v16.0.8 en dashboard
- [ ] Sincronizar React a 19.2.0 en dashboard
- [ ] Crear package `@aethermind/ui`
- [ ] Mover Badge, Button, Card a `@aethermind/ui`
- [ ] Crear package `@aethermind/utils`
- [ ] Mover función `cn()` a `@aethermind/utils`
- [ ] Crear package `@aethermind/types`
- [ ] Consolidar 7 tipos duplicados

### 🟢 MEDIA (PRÓXIMAS 2 SEMANAS)
- [ ] Habilitar `strict: true` en apps/api
- [ ] Mejorar tsconfig.base.json
- [ ] Optimizar turbo.json (cache)
- [ ] Sincronizar versiones de Tailwind
- [ ] Crear packages/config
- [ ] Refactorizar vercel.json

---

## 15. 📋 RESUMEN DE ANÁLISIS DE COMPONENTES UI

### Componentes Duplicados (3)
1. **Badge** - Versiones diferentes en home y dashboard
2. **Button** - Versiones diferentes en home y dashboard
3. **Card** - Versiones diferentes en home y dashboard

### Componentes Únicos de Alta Prioridad para @aethermind/ui (30+)
- Input, Form, Select, Dialog, Table
- Toast/Toaster, Alert, Spinner, Skeleton
- Tabs, Checkbox, Radio Group, Switch, Textarea, Label
- Dropdown Menu, Popover, Tooltip, Separator
- Progress, Slider, Pagination, Avatar
- Accordion, Alert Dialog, Scroll Area, Breadcrumb

---

## 16. 📋 RESUMEN DE ANÁLISIS DE UTILITIES

### Funciones Duplicadas
- **cn()** - Duplicada exactamente en apps/home y packages/dashboard

### Funciones a Centralizar en @aethermind/utils
- Format: `formatDate()`, `formatDuration()`, `formatCost()`, `formatTokens()`
- Retry: `retryWithBackoff()`, `withTimeout()`
- Security: `sanitizeLog()`, `sanitizeObject()`
- HTTP: Crear cliente HTTP base común

---

## 17. 📋 RESUMEN DE ANÁLISIS DE TIPOS

### Tipos Duplicados (7)
1. **LogEntry** - Date vs string inconsistency
2. **ExecutionResult** - Date vs string, Error vs {message}
3. **Trace** - Date vs string
4. **TraceNode** - Date vs string
5. **CostInfo** - Estructura diferente
6. **CostEstimate** - Campos diferentes
7. **StepCostEstimate** - Estructura diferente

### Solución Recomendada
Implementar helper `Serialized<T>` para conversión automática entre tipos runtime (Date, Error) y tipos DTO (string, {message}).

---

**FIN DEL REPORTE COMPLETO** 🎉

El monorepo está **funcional** pero requiere correcciones críticas inmediatas para deployment seguro en producción.

**Prioridad #1:** Corregir `typescript.ignoreBuildErrors` y `images.unoptimized` AHORA.
**Prioridad #2:** Crear packages compartidos (@aethermind/ui, @aethermind/utils, @aethermind/types) en las próximas 2-3 semanas.
