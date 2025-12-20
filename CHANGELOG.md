# 📝 Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Planificado

- [ ] Tests E2E con Playwright
- [ ] Mejoras de accesibilidad (WCAG 2.1 AA)
- [ ] Integración con Stripe para pagos
- [ ] Blog con MDX
- [ ] Multi-idioma (i18n)

---

## [0.1.0] - 2025-12-20

### 🎉 Lanzamiento Inicial

#### ✨ Added (Agregado)

- **Landing Page Completa**

  - Hero section con neural background animado
  - Problem-solution section
  - Social proof con testimonios
  - Capacidades y features showcase
  - Pricing section con 3 planes
  - Footer completo con links

- **Páginas Estáticas**

  - `/` - Homepage
  - `/about` - Sobre Aethermind
  - `/login` - Formulario de iniciosesión
  - `/signup` - Formulario de registro
  - `/docs` - Documentación
  - `/docs/api` - Documentación de API
  - `/contact` - Contacto
  - `/terms` - Términos y condiciones
  - `/privacy` - Política de privacidad
  - `/security` - Seguridad
  - `/cookies` - Política de cookies
  - `/blog` - Blog (placeholder)
  - `/changelog` - Changelog

- **Flujo de Onboarding**

  - `/onboarding/welcome` - Bienvenida
  - `/onboarding/demo` - Demo del producto
  - `/onboarding/value` - Propuesta de valor
  - `/onboarding/pricing` - Pricing

- **Componentes UI** (40+ componentes Radix UI)

  - Button variants (primary, secondary, outline, ghost)
  - Input con validación
  - Dialog/Modal system
  - Dropdown menus
  - Navigation menu
  - Tabs
  - Tooltips
  - Toast notifications
  - Y muchos más...

- **Animaciones**

  - Neural background con Framer Motion
  - Scroll animations
  - Hover effects
  - Page transitions

- **Formularios**

  - React Hook Form integration
  - Zod schema validation
  - Error handling
  - Success states

- **Optimizaciones**

  - Static Site Generation (SSG)
  - Image optimization con next/image
  - Font optimization (Inter de Google Fonts)
  - TailwindCSS purge automático

- **Analytics**

  - Vercel Analytics integrado
  - Google Analytics preparado (opcional)

- **Deployment**
  - Configuración para Vercel
  - Auto-deployment desde GitHub
  - Environment variables setup

#### 📚 Documentation (Documentación)

- README.md profesional completo
- CONTRIBUTING.md con guías de contribución
- docs/DEPLOYMENT.md - Guía de deployment
- docs/ARCHITECTURE.md - Arquitectura del sistema
- docs/DEVELOPMENT.md - Guía de desarrollo (pending)
- docs/AUDITORIA_QA_LANDING.md - QA audit

#### 🔧 Configuration (Configuración)

- Next.js 16.0.10 con App Router
- TypeScript 5.x strict mode
- TailwindCSS 4.1.9
- ESLint configurado
- Prettier(configurado implícitamente)

#### 🔐 Security (Seguridad)

- Environment variables para secrets
- Redirect seguro a dashboard externo
- Input sanitization
- HTTPS enforced (Vercel)

---

## [0.0.1] - 2025-12-18

### 🏗️ Setup Inicial

#### Added

- Inicialización del proyecto Next.js 16
- Configuración de Turborepo (después eliminado)
- Estructura de monorepo inicial
- Instalación de dependencias base

#### Changed

- Migración de pnpm a npm para compatibility con Vercel
- Simplificación de estructura (eliminación de backend)

#### Removed

- Backend API (movido a repo separado)
- packages/core (movido a repo separado)
- packages/dashboard (movido a repo separado)
- packages/sdk (movido a repo separado)
- Configuración de Turborepo
- pnpm workspace config

---

## Formato de Versiones

### [X.Y.Z]

- **X (Major)**: Cambios incompatibles con versiones anteriores
- **Y (Minor)**: Nuevas funcionalidades compatibles
- **Z (Patch)**: Bug fixes y mejoras menores

### Tipos de Cambios

- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidades existentes
- **Deprecated**: Funcionalidades que serán removidas
- **Removed**: Funcionalidades removidas
- **Fixed**: Bug fixes
- **Security**: Arreglos de seguridad

---

## Notas de Migración

### De 0.0.1 a 0.1.0

**Cambios Importantes**:

1. Estructura del proyecto simplificada
2. Eliminación de backend (ahora en repo separado)
3. Cambio de pnpm a npm

**Acción Requerida**:

- Actualizar variables de entorno (`NEXT_PUBLIC_DASHBOARD_URL`)
- Re-configurar deployment en Vercel con Root Directory: `apps/home`

---

## Links

- [Historial Completo de Commits](https://github.com/gonzacba17/Aethermind-Page/commits/main)
- [Releases](https://github.com/gonzacba17/Aethermind-Page/releases)
- [Issues](https://github.com/gonzacba17/Aethermind-Page/issues)
- [Pull Requests](https://github.com/gonzacba17/Aethermind-Page/pulls)

---

**[Unreleased]**: https://github.com/gonzacba17/Aethermind-Page/compare/v0.1.0...HEAD
**[0.1.0]**: https://github.com/gonzacba17/Aethermind-Page/releases/tag/v0.1.0
**[0.0.1]**: https://github.com/gonzacba17/Aethermind-Page/releases/tag/v0.0.1
