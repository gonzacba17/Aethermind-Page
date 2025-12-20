# 🚀 Aethermind Landing Page

[![Deployment Status](https://img.shields.io/badge/deployment-vercel-black)](https://aethermind-page.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> 🌐 Landing page oficial de Aethermind - Plataforma enterprise de AgentOS para gestión de agentes de IA con control de costos FinOps integrado.

🔗 **Live Demo**: [https://aethermind-page.vercel.app](https://aethermind-page.vercel.app)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Instalación](#-instalación)
- [Desarrollo](#-desarrollo)
- [Deployment](#-deployment)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contribuir](#-contribuir)
- [Documentación](#-documentación)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎨 Landing Page Premium

- **Diseño moderno** con animaciones fluidas (Framer Motion)
- **Neural background** animado para efecto visual impactante
- **Responsive design** optimizado para mobile, tablet y desktop
- **Dark mode** nativo con Next.js Themes

### 📄 Páginas Estáticas

- `/` - Landing page con hero, features, pricing
- `/about` - Sobre Aethermind
- `/login` - Formulario de inicio de sesión
- `/signup` - Registro de usuarios
- `/docs` - Documentación de la API
- `/pricing` - Planes y precios
- `/contact` - Formulario de contacto
- `/terms`, `/privacy`, `/security`, `/cookies` - Legales

### 🔐 Autenticación

- Formularios de **login/signup** con validación
- Redirección automática al **dashboard externo** después de autenticación
- Integración con dashboard en: `https://aethermind-agent-os-dashboard.vercel.app`

### 🚀 Optimizaciones

- **Static Site Generation (SSG)** para máxima velocidad
- **Next.js 16** con Turbopack para builds ultra rápidos
- **TailwindCSS 4** para estilos optimizados
- **Vercel Analytics** integrado
- **SEO optimizado** con metadata dinámica

---

## 🛠️ Tech Stack

### Core

- **[Next.js 16.0.10](https://nextjs.org/)** - React framework con App Router
- **[React 18.3.1](https://react.dev/)** - UI library
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Type safety

### Styling

- **[TailwindCSS 4.1.9](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - 40+ componentes accesibles
- **[Framer Motion](https://www.framer.com/motion/)** - Animaciones

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### Deployment

- **[Vercel](https://vercel.com/)** - Hosting y CI/CD automático

---

## 📦 Instalación

### Prerrequisitos

```bash
node >= 20.9.0
npm >= 9.0.0
```

### Clonar Repositorio

```bash
git clone https://github.com/gonzacba17/Aethermind-Page.git
cd Aethermind-Page
```

### Instalar Dependencias

```bash
cd apps/home
npm install
```

### Variables de Entorno

Crear archivo `.env.local` en `apps/home/`:

```env
# Dashboard URL (donde redirigir después de login)
NEXT_PUBLIC_DASHBOARD_URL=https://aethermind-agent-os-dashboard.vercel.app

# Stripe (opcional, para pagos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 💻 Desarrollo

### Ejecutar en Desarrollo

```bash
# En apps/home/
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001) en tu navegador.

### Build de Producción

```bash
npm run build
npm start
```

### Linting y Type Checking

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript validation
```

---

## 🚀 Deployment

### Vercel (Recomendado)

El proyecto se despliega automáticamente en Vercel con cada push a `main`.

**Configuración en Vercel Dashboard**:

```
Framework Preset: Next.js
Root Directory: apps/home
Build Command: npm run build (auto-detectado)
Output Directory: .next (auto-detectado)
Install Command: npm install
```

**Variables de Entorno en Vercel**:

- `NEXT_PUBLIC_DASHBOARD_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (opcional)

### Deployment Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd apps/home
vercel --prod
```

Ver [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para más detalles.

---

## 📁 Estructura del Proyecto

```
Aethermind-Page/
├── apps/
│   └── home/                    # Landing page (Next.js 16)
│       ├── app/                 # App Router
│       │   ├── page.tsx         # Homepage
│       │   ├── login/           # Login page
│       │   ├── signup/          # Signup page
│       │   ├── about/           # About page
│       │   └── ...              # Otras páginas
│       ├── components/          # Componentes React
│       │   ├── ui/              # Componentes UI base (Radix)
│       │   ├── site-header.tsx
│       │   ├── site-footer.tsx
│       │   └── ...
│       ├── lib/                 # Utilidades
│       ├── public/              # Assets estáticos
│       ├── styles/              # Estilos globales
│       └── package.json
├── docs/                        # Documentación
│   ├── ARCHITECTURE.md          # Arquitectura del proyecto
│   ├── DEPLOYMENT.md            # Guía de deployment
│   ├── DEVELOPMENT.md           # Guía de desarrollo
│   └── AUDITORIA_QA_LANDING.md  # QA audit
├── .gitignore
├── package.json                 # Root package.json
├── README.md                    # Este archivo
└── CHANGELOG.md                 # Historial de cambios
```

---

## 🔧 Scripts Disponibles

### En `/apps/home`:

| Script              | Descripción                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Inicia servidor de desarrollo en puerto 3001 |
| `npm run build`     | Crea build de producción optimizado          |
| `npm start`         | Inicia servidor de producción                |
| `npm run lint`      | Ejecuta ESLint                               |
| `npm run typecheck` | Valida tipos de TypeScript                   |

### En raíz del proyecto:

| Script          | Descripción                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Alias de `cd apps/home && npm run dev`   |
| `npm run build` | Alias de `cd apps/home && npm run build` |
| `npm start`     | Alias de `cd apps/home && npm start`     |

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre nuestro código de conducta y proceso de pull requests.

### Quick Start para Contribuidores

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📚 Documentación

- **[Arquitectura](docs/ARCHITECTURE.md)** - Estructura y diseño del sistema
- **[Guía de Desarrollo](docs/DEVELOPMENT.md)** - Setup local y workflow
- **[Guía de Deployment](docs/DEPLOYMENT.md)** - Deployment a producción
- **[QA Audit](docs/AUDITORIA_QA_LANDING.md)** - Auditoría de calidad

---

## 🔗 Enlaces Importantes

- **Sitio Web**: [https://aethermind-page.vercel.app](https://aethermind-page.vercel.app)
- **Dashboard**: [https://aethermind-agent-os-dashboard.vercel.app](https://aethermind-agent-os-dashboard.vercel.app)
- **Documentación API**: [https://aethermind-page.vercel.app/docs](https://aethermind-page.vercel.app/docs)
- **Repositorio**: [https://github.com/gonzacba17/Aethermind-Page](https://github.com/gonzacba17/Aethermind-Page)

---

## 📝 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para historial completo de cambios.

**Última versión**: `0.1.0` - Landing page inicial con login/signup

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

Desarrollado por **Aethermind Team**

- **Website**: [aethermind.com](https://aethermind-page.vercel.app)
- **Email**: contact@aethermind.com
- **GitHub**: [@gonzacba17](https://github.com/gonzacba17)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Vercel](https://vercel.com/) - Hosting y deployment
- [Radix UI](https://www.radix-ui.com/) - Componentes UI
- [TailwindCSS](https://tailwindcss.com/) - Utility CSS

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!**
