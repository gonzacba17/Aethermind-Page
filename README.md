# Aethermind - Landing Page

Landing page moderna para **Aethermind**, un SaaS de orquestación de IA con predicción de costos y workflows multi-agente.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.3
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Animations**: Framer Motion (latest)
- **Styles**: Tailwind CSS 4.1.9
- **Icons**: Lucide React 0.454.0
- **UI Components**: Radix UI (completo)
- **Forms**: React Hook Form + Zod
- **Typography**: Geist Sans (Next.js)
- **Analytics**: Vercel Analytics

---

## 📂 Estructura del Proyecto

```
c:\wamp64\www\pag/
├── app/
│   ├── layout.tsx          # Layout raíz con metadata y fonts
│   ├── page.tsx            # Página principal (composición de secciones)
│   └── globals.css         # Estilos globales
│
├── components/
│   ├── neural-background.tsx    # Canvas animado de estrellas (parallax)
│   ├── site-header.tsx          # Header con nav + hamburger mobile
│   ├── intro-sequence.tsx       # Hero section con CTAs
│   ├── problem-solution.tsx     # Problema/solución + stats
│   ├── social-proof.tsx         # Testimonios + trust badges
│   ├── capacidades-section.tsx  # Grid de features (6 cards)
│   ├── pricing-section.tsx      # 3 planes de pricing
│   ├── site-footer.tsx          # Footer con CTA + links
│   │
│   ├── faq-section.tsx          # FAQ (no usado actualmente)
│   ├── floating-toolbar.tsx     # Toolbar (no usado actualmente)
│   ├── ide-mockup.tsx           # IDE demo (no usado actualmente)
│   ├── terminal-demo.tsx        # Terminal demo (no usado actualmente)
│   ├── scroll-section.tsx       # Scroll helper (no usado actualmente)
│   │
│   └── ui/                      # 57 componentes Radix UI + shadcn
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (accordion, alert, avatar, etc.)
│
├── hooks/
│   └── use-mobile.tsx           # Hook para detección mobile
│
├── lib/
│   └── utils.ts                 # Utilidades (cn, etc.)
│
├── public/
│   ├── file.svg
│   ├── globe.svg
│   └── window.svg
│
├── styles/
│   └── globals.css              # Alias de app/globals.css
│
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── components.json              # Config de shadcn/ui
└── README.md
```

---

## 🎨 Diseño Visual

### Paleta de Colores

**Esquema minimalista blanco y negro**:

- **Background**: Negro puro (#000000)
- **Texto primario**: Blanco (#ffffff)
- **Texto secundario**: neutral-400, neutral-500, neutral-600
- **Bordes**: neutral-800, neutral-900
- **Acentos**: Blanco para hover states
- **Especial**: Rojo para badge de problema (red-500/20, red-400)

### Tipografía

- **Font principal**: Geist Sans (variable font de Next.js)
- **Pesos**: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)
- **Tamaños responsive**: text-6xl → text-8xl → text-9xl (hero)

### Efectos y Animaciones

1. **Parallax hero**: Contenido fade/scale en scroll
2. **Fade-in sections**: Animaciones `whileInView` (Framer Motion)
3. **Hover effects**:
   - Botones: `scale-105` (estilo Antigravity)
   - Cards: `border-white/20`
4. **Starfield**: Movimiento constante de partículas con interacción de mouse
5. **Backdrop blur**: Aplicado a elementos flotantes (`backdrop-blur-sm/md`)
6. **Transiciones suaves**: 300ms-800ms de duración

---

## 📱 Responsive Design

- **Mobile (< 640px)**:

  - Hero title: `text-6xl`
  - Grids de 1 columna
  - Botones apilados
  - Hamburger menu

- **Tablet (640px - 1024px)**:

  - Hero title: `text-8xl`
  - Grids de 2 columnas
  - Espaciado compacto

- **Desktop (> 1024px)**:
  - Hero title: `text-9xl`
  - Grids de 3-4 columnas
  - Espaciado máximo

---

## 🎯 Secciones de la Landing Page

### 1. Hero Section (`intro-sequence.tsx`)

- Badge "AI Agent Orchestration" con ícono lightning
- Headline: "Control Your AI Costs. Ship Faster."
- Subheadline con énfasis en "before"
- 2 CTAs: "Start Free" (primario) + "View Demo" (secundario)
- Social proof badges: No credit card | 2 min setup | Open source core
- Scroll indicator animado

**Comportamiento**: Fade out y scale down en scroll

---

### 2. Problem/Solution (`problem-solution.tsx`)

- Statement del problema: "AI Costs Are Unpredictable"
- 3 cards de solución:
  1. **Cost Prediction** (DollarSign icon) - Code block con costo estimado
  2. **Multi-Agent Orchestration** (Network icon) - Pills de GPT-4, Claude, Gemini
  3. **Real-time Monitoring** (BarChart3 icon) - Dot verde pulsante + WebSocket
- Stats row: 40% savings | 10x faster | 100% visibility

---

### 3. Social Proof (`social-proof.tsx`)

- Testimonial principal: Alex Chen, CTO @ Neural Labs AI
- Quote: "We reduced our AI costs by 40% in the first month"
- Stats grid: 500+ Teams | 2M+ Executions | $1M+ Saved | 99.9% Uptime
- "Trusted by" logos (text-based, minimal)

---

### 4. Capacidades (`capacidades-section.tsx`)

Grid de 6 features:

1. Cost Estimation (DollarSign)
2. Multi-Agent Workflows (Network)
3. Real-time Analytics (BarChart3)
4. JWT Authentication (Shield)
5. Usage Limits (Users)
6. Task Queue (Zap / BullMQ)

**Diseño**: Cards transparentes con hover effect en ícono

---

### 5. Pricing (`pricing-section.tsx`)

3 planes:

1. **Free** - $0/forever (100 exec/mes, 3 agents, 1 workflow)
2. **Starter** ⭐ - $49/mes (10K exec, 20 agents, 10 workflows) - Most Popular
3. **Pro** - $199/mes (100K exec, unlimited agents/workflows)

**Destacado**: Plan Starter con border-white, bg-white/5, scale-105

---

### 6. Header (`site-header.tsx`)

- Logo "AETHERMIND"
- 4 links de navegación: Features, Pricing, Docs, GitHub
- CTA: "Start Free"
- Hamburger menu responsive (mobile)
- Sticky con backdrop-blur

---

### 7. Footer (`site-footer.tsx`)

**CTA superior**:

- "Ready to control your AI costs?"
- Botón "Start Free →"

**Links grid** (4 columnas):

1. AETHERMIND (descripción)
2. Product (Features, Pricing, Docs, API, Changelog)
3. Company (About, Blog, GitHub, Status, Contact)
4. Legal (Terms, Privacy, Security, Cookies)

**Bottom bar**: © 2025 + Social links (𝕏, GitHub, Discord)

---

## 🌐 Cómo Ejecutar

```bash
# Instalar dependencias
npm install
# o
pnpm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm start

# Lint
npm run lint
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📝 Filosofía de Diseño

- **Minimalismo**: Solo blanco, negro y grises
- **Claridad**: Mensaje directo sobre control de costos
- **Confianza**: Social proof, pricing transparente
- **Acción**: CTAs claros en toda la página
- **Inspiración**: Antigravity (Google), Vercel, Linear

**Objetivo**: Convertir visitantes mostrando valor (predicción de costos) antes de pedir signup.

---

## 🔄 Historial de Cambios

### v2.0 (Actual)

**Removido**:

- ❌ Sección "Built for Developers" (IDE mockup)
- ❌ Sección "Potencia Empresarial" (Terminal demo)
- ❌ Sección "Floating Toolbar" standalone
- ❌ Sección FAQ

**Agregado**:

- ✅ Sección Problem/Solution
- ✅ Sección Social Proof
- ✅ Footer mejorado con CTA
- ✅ Header simplificado (6 links → 4 links)

**Actualizado**:

- ✅ Todos los botones: `rounded-lg` → `rounded-full`
- ✅ Hover scales: `1.1x` → `1.05x`
- ✅ Efectos `backdrop-blur` agregados
- ✅ Font weights más ligeros en subtítulos

**Resultado**: Landing page más limpia y enfocada (6 secciones vs 8 previas)

---

## 🎯 Features Clave

1. **Diseño inspirado en Antigravity**: Botones rounded-full, blur effects, espaciado generoso
2. **Production-ready**: Features reales (JWT auth, cost tracking, BullMQ)
3. **Social proof**: Testimonios, stats, trust indicators
4. **Pricing claro**: 3 tiers con features transparentes
5. **Navbar minimal**: Solo links esenciales
6. **Performance**: Animaciones GPU-accelerated, rendering optimizado
7. **SEO-ready**: HTML semántico, jerarquía de headings correcta
8. **Responsive**: Mobile-first con hamburger menu

---

## 🛠️ Componentes Disponibles (No Usados)

Estos componentes están en el proyecto pero **no se usan actualmente** en `page.tsx`:

- `faq-section.tsx` - Sección de preguntas frecuentes
- `floating-toolbar.tsx` - Toolbar flotante
- `ide-mockup.tsx` - Mockup de IDE con código
- `terminal-demo.tsx` - Demo de terminal animado
- `scroll-section.tsx` - Helper de scroll

Pueden ser reintegrados o removidos según necesidad.

---

## 📦 Dependencias Principales

```json
{
  "next": "16.0.3",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "framer-motion": "latest",
  "lucide-react": "^0.454.0",
  "tailwindcss": "^4.1.9",
  "@radix-ui/*": "latest",
  "react-hook-form": "^7.60.0",
  "zod": "3.25.76",
  "next-themes": "^0.4.6"
}
```

---

## 🔗 Links Útiles

- **Proyecto**: Aethermind SaaS (IA/Programación para empresas B2B)
- **Análisis de Logo**: Ver `analisis_logo_aethermind.md` en artifacts
- **Diferenciador**: El compromiso

---

**Desarrollado con ❤️ para Aethermind**
