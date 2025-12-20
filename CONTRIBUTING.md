# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Aethermind Landing Page! Esta guía te ayudará a entender nuestro proceso de desarrollo y cómo puedes colaborar efectivamente.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Proceso de Development](#proceso-de-development)
- [Estándares de Código](#estándares-de-código)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporte de Bugs](#reporte-de-bugs)
- [Sugerencias de Features](#sugerencias-de-features)

---

## 📜 Código de Conducta

Este proyecto adhiere a un código de conducta profesional. Al participar, se espera que:

- Uses lenguaje respetuoso e inclusivo
- Aceptes críticas constructivas de manera profesional
- Te enfoques en lo que es mejor para la comunidad
- Muestres empatía hacia otros miembros de la comunidad

---

## 🎯 ¿Cómo puedo contribuir?

### 1. Reportar Bugs 🐛

- Usa la plantilla de issue para bugs
- Incluye pasos detallados para reproducir
- Adjunta screenshots si es posible
- Menciona tu entorno (OS, navegador, versión de Node)

### 2. Sugerir Features 💡

- Usa la plantilla de issue para features
- Describe claramente el problema que resuelve
- Explica por qué es valioso para usuarios
- Considera alternativas si existen

### 3. Mejorar Documentación 📚

- Corrige typos o errores
- Agrega ejemplos claros
- Mejora explicaciones confusas
- Traduce a otros idiomas

### 4. Contribuir Código 💻

- Implementa nuevas features
- Arregla bugs existentes
- Mejora performance
- Refactoriza código

---

## 🔧 Proceso de Development

### Setup Inicial

1. **Fork el repositorio**

   ```bash
   # Navega a https://github.com/gonzacba17/Aethermind-Page
   # Haz clic en "Fork"
   ```

2. **Clona tu fork**

   ```bash
   git clone https://github.com/TU-USUARIO/Aethermind-Page.git
   cd Aethermind-Page
   ```

3. **Agrega upstream remote**

   ```bash
   git remote add upstream https://github.com/gonzacba17/Aethermind-Page.git
   ```

4. **Instala dependencias**

   ```bash
   cd apps/home
   npm install
   ```

5. **Crea branch de feature**
   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

### Workflow de Desarrollo

1. **Mantén tu fork actualizado**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Desarrolla tu feature**

   ```bash
   npm run dev  # Servidor de desarrollo
   ```

3. **Verifica calidad**

   ```bash
   npm run lint       # ESLint
   npm run typecheck  # TypeScript
   npm run build      # Build de producción
   ```

4. **Commit tus cambios**

   ```bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   ```

5. **Push a tu fork**
   ```bash
   git push origin feature/nombre-descriptivo
   ```

---

## 📐 Estándares de Código

### TypeScript

- ✅ **Usa tipos explícitos** siempre que sea posible
- ✅ **Evita `any`**, usa `unknown` si es necesario
- ✅ **Define interfaces** para props de componentes
- ✅ **Usa enums** para valores constantes

```typescript
// ✅ Correcto
interface ButtonProps {
  variant: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ variant, onClick, children }: ButtonProps) {
  // ...
}

// ❌ Incorrecto
export function Button(props: any) {
  // ...
}
```

### React Components

- ✅ **Componentes funcionales** con hooks
- ✅ **Nombres en PascalCase** para componentes
- ✅ **Props destructuring** en parámetros
- ✅ **Export named** para componentes

```typescript
// ✅ Correcto
export function HeroSection({ title, subtitle }: HeroSectionProps) {
  return (
    <section className="hero">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

// ❌ Incorrecto
export default (props) => {
  return <div>{props.title}</div>;
};
```

### Styling (TailwindCSS)

- ✅ **Usa clases de Tailwind** en lugar de CSS custom
- ✅ **Agrupa clases** con `cn()` de `lib/utils`
- ✅ **Mobile-first** approach
- ✅ **Usa variables CSS** para temas

```typescript
// ✅ Correcto
<button className={cn(
  "px-4 py-2 rounded-lg",
  "bg-primary text-white",
  "hover:bg-primary/90 transition-colors",
  className
)}>
  {children}
</button>

// ❌ Incorrecto
<button style={{ backgroundColor: '#000', padding: '10px' }}>
  {children}
</button>
```

### File Organization

```
components/
├── ui/              # Componentes base (Radix UI)
│   ├── button.tsx
│   └── input.tsx
├── sections/        # Secciones de páginas
│   ├── hero.tsx
│   └── pricing.tsx
└── layout/          # Layout components
    ├── header.tsx
    └── footer.tsx
```

---

## 📝 Commit Guidelines

Usamos **Conventional Commits** para mensajes claros y autoexplicativos.

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type       | Descripción                            | Ejemplo                                   |
| ---------- | -------------------------------------- | ----------------------------------------- |
| `feat`     | Nueva feature                          | `feat(auth): add Google OAuth login`      |
| `fix`      | Bug fix                                | `fix(ui): correct button alignment`       |
| `docs`     | Cambios en documentación               | `docs(readme): update installation steps` |
| `style`    | Cambios de formato (no afectan código) | `style: format with prettier`             |
| `refactor` | Refactorización de código              | `refactor(api): simplify error handling`  |
| `perf`     | Mejoras de performance                 | `perf(images): optimize logo loading`     |
| `test`     | Agregar o modificar tests              | `test(auth): add login form tests`        |
| `chore`    | Tareas de mantenimiento                | `chore(deps): update dependencies`        |

### Ejemplos

```bash
# Feature
feat(pricing): add enterprise tier pricing option

# Bug fix
fix(login): resolve redirect loop after authentication

# Documentación
docs(contributing): add commit message guidelines

# Refactor
refactor(components): extract reusable Button component
```

---

## 🔀 Pull Request Process

### 1. Prepara tu PR

- ✅ Tu código sigue los estándares del proyecto
- ✅ Agregaste/actualizaste tests si es necesario
- ✅ Actualizaste documentación relevante
- ✅ Build pasa sin errores (`npm run build`)
- ✅ Linting pasa (`npm run lint`)
- ✅ TypeCheck pasa (`npm run typecheck`)

### 2. Crea el Pull Request

**Título**: Debe seguir formato de commits

```
feat(auth): add password reset functionality
```

**Descripción**: Usa esta plantilla

```markdown
## 📋 Descripción

Breve descripción del cambio y por qué es necesario.

## 🔗 Issue Relacionado

Fixes #123

## ✅ Checklist

- [ ] Código sigue estándares del proyecto
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Build pasa sin errores
- [ ] Linting pasa
- [ ] TypeCheck pasa

## 📸 Screenshots (si aplica)

[Screenshots o GIFs del cambio visual]

## 🧪 ¿Cómo se probó?

Describe cómo probaste los cambios.
```

### 3. Code Review

- Responde a comentarios de manera constructiva
- Realiza los cambios solicitados
- Push updates a la misma branch
- Marca conversaciones como resueltas

### 4. Merge

- El reviewer aprobará y hará merge
- Tu branch será eliminada automáticamente
- Celebra tu contribución! 🎉

---

## 🐛 Reporte de Bugs

### Antes de Reportar

1. **Busca en issues existentes** - Quizás ya fue reportado
2. **Verifica en última versión** - El bug puede estar arreglado
3. **Reproduce en limpio** - Sin extensiones o modificaciones

### Template de Bug Report

```markdown
**Describe el bug**
Descripción clara y concisa del bug.

**Pasos para Reproducir**

1. Ve a '...'
2. Haz clic en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Qué esperabas que sucediera.

**Screenshots**
Si aplica, agrega screenshots.

**Entorno:**

- OS: [e.g. Windows 11]
- Navegador: [e.g. Chrome 120]
- Versión Node: [e.g. 20.10.0]

**Contexto Adicional**
Cualquier otra información relevante.
```

---

## 💡 Sugerencias de Features

### Template de Feature Request

```markdown
**¿Tu feature está relacionada a un problema?**
Descripción clara del problema. Ej: "Siempre me frustro cuando [...]"

**Describe la solución que te gustaría**
Descripción clara de qué quieres que suceda.

**Describe alternativas que consideraste**
Otras soluciones o features que consideraste.

**Contexto Adicional**
Screenshots, mockups, o ejemplos de otras apps.
```

---

## 🎨 Guía de Estilo UI/UX

### Principios de Diseño

1. **Consistencia**: Usa componentes existentes de Radix UI
2. **Accesibilidad**: ARIA labels, keyboard navigation
3. **Responsive**: Mobile-first, tablet, desktop
4. **Performance**: Lazy loading, optimización de imágenes

### Colores

```css
/* Usar variables CSS definidas en globals.css */
--primary: ...
--secondary: ...
--background: ...
--foreground: ...
```

### Animaciones

```typescript
// Usar Framer Motion para animaciones complejas
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>;
```

---

## 🏆 Contributors

¡Gracias a todos los que han contribuido!

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- Será llenado automáticamente -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## ❓ Preguntas

Si tienes preguntas sobre cómo contribuir:

1. Revisa la [documentación](docs/)
2. Busca en issues cerrados
3. Abre un nuevo issue con la etiqueta `question`
4. Contacta al equipo: contact@aethermind.com

---

**¡Gracias por contribuir a Aethermind! 🚀**
