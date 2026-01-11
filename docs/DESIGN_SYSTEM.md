# Decision OS Design System

> Based on **Universal UI Designer** Methodology
> Created: 2026-01-11

## 🎯 Design Philosophy

**Design System First Mindset**
- ✅ ALWAYS use semantic tokens (--primary, --accent)
- ✅ NEVER write direct colors in components
- ✅ CREATE component variants instead of className overrides
- ✅ USE HSL format for all colors

**Brand Personality**: Editorial + Data-driven, Professional, Confident

**Target Audience**: Product Managers, Engineering Leads

**Industry**: Product Management / Decision Intelligence

---

## 🎨 Color System

### Color Psychology Analysis

| Color | Psychology | Usage |
|-------|-----------|-------|
| **Teal** (Primary) | Trust, professionalism, data-driven clarity | Main brand, headers, CTAs |
| **Amber** (Accent) | Action, warmth, important decisions | Warnings, Iterate status, highlights |
| **Slate** (Secondary) | Neutrality, editorial tone | Supporting text, borders |

### Semantic Color Tokens (HSL Format)

```css
/* Primary Brand Colors */
--primary: 172 91% 41%;              /* Teal-600 */
--primary-light: 172 91% 55%;        /* Teal-500 */
--primary-dark: 172 91% 28%;         /* Teal-700 */
--primary-glow: 172 91% 65%;         /* Hover states */
--primary-foreground: 0 0% 100%;

/* Accent Colors (Complementary harmony) */
--accent: 38 92% 50%;                /* Amber-500 */
--accent-light: 38 92% 65%;
--accent-dark: 38 92% 38%;
--accent-foreground: 0 0% 100%;

/* Semantic Status Colors */
--success: 142 71% 45%;              /* Green: VALIDATED */
--warning: 38 92% 50%;               /* Amber: REVIEW/ITERATE */
--error: 0 84% 60%;                  /* Red: NOT_VALIDATED */
--info: 199 89% 48%;                 /* Blue: Information */
```

### Usage in Tailwind

```tsx
// ✅ Correct - Use semantic tokens
<button className="bg-primary text-primary-foreground">
<div className="bg-accent text-accent-foreground">
<span className="text-success">Validated</span>

// ❌ Wrong - Direct colors
<button className="bg-teal-600">
<div className="bg-amber-500">
```

---

## ✨ Visual Effects & Gradients

### Gradients

```css
--gradient-primary: linear-gradient(135deg, hsl(172 91% 41%), hsl(172 91% 55%));
--gradient-primary-to-accent: linear-gradient(135deg, hsl(172 91% 41%), hsl(38 92% 50%));
--gradient-editorial: linear-gradient(180deg, hsl(60 9% 98%), hsl(24 6% 96%));
```

Usage:
```tsx
<div className="bg-gradient-primary">
<div className="bg-gradient-primary-to-accent">
```

### Shadows (Editorial Style - Subtle, Refined)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-glow: 0 0 40px hsla(172, 91%, 41%, 0.3);
--shadow-accent-glow: 0 0 40px hsla(38, 92%, 50%, 0.3);
```

Usage:
```tsx
<div className="shadow-glow hover-lift">
```

---

## 🎬 Animations & Micro-Interactions

### Available Animations

| Animation | Purpose | Usage |
|-----------|---------|-------|
| `fade-in-up` | Page entrance | `animate-fade-in-up` |
| `fade-in` | Element reveal | `animate-fade-in` |
| `slide-in-right` | Sidebar/drawer | `animate-slide-in-right` |
| `glow-pulse` | Attention (sparingly) | `animate-glow-pulse` |
| `float` | Ambient movement | `animate-float` |

### Transitions

```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

Usage:
```tsx
<button className="transition-smooth hover:scale-105">
<div className="transition-fast hover-lift">
```

---

## 📐 Spacing System (8px Base Unit)

| Class | Size | Usage |
|-------|------|-------|
| `gap-2` | 8px | Tight elements |
| `gap-4` | 16px | Default spacing |
| `gap-6` | 24px | Card padding |
| `gap-8` | 32px | Section elements |
| `py-12` | 48px | Small sections |
| `py-16` | 64px | Medium sections |
| `py-24` | 96px | Large sections |

---

## 🔤 Typography Hierarchy

### Heading Scale (Mobile → Desktop)

```tsx
text-sm     → text-base    /* Body text */
text-lg     → text-xl      /* Subheadings */
text-2xl    → text-4xl     /* Section headings */
text-4xl    → text-6xl     /* Page headings */
text-5xl    → text-7xl     /* Hero headings */
```

### Font Settings

```css
body {
  font-feature-settings: "rlig" 1, "calt" 1;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.02em;  /* Tighter tracking for editorial feel */
}
```

---

## 🎨 Decision Cycle Status Colors

Mapped from semantic tokens:

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case "DRAFTING": return "bg-amber-100 text-amber-800";  // --warning
    case "EXECUTING": return "bg-blue-100 text-blue-800";    // --info
    case "REVIEW": return "bg-purple-100 text-purple-800";
    case "OUTCOME": return "bg-teal-100 text-teal-800";      // --primary
    case "CLOSED": return "bg-neutral-100 text-neutral-800";
    default: return "bg-neutral-100 text-neutral-800";
  }
};
```

---

## ✅ Quality Checklist

Before marking design work complete:

### Design System Compliance
- [ ] No direct colors in components (use semantic tokens)
- [ ] All gradients defined in CSS variables
- [ ] Component variants created instead of overrides
- [ ] Consistent spacing using 8px system
- [ ] Typography hierarchy maintained

### Visual Polish
- [ ] WCAG AA contrast ratios (4.5:1 minimum)
- [ ] Consistent border radius usage
- [ ] Shadow system applied consistently
- [ ] Hover states on all interactive elements
- [ ] Loading and error states designed

### Performance & Accessibility
- [ ] Animations use transform/opacity only
- [ ] prefers-reduced-motion respected
- [ ] Semantic HTML structure
- [ ] Focus states clearly visible
- [ ] Alt text for all images

---

## 🚫 Anti-Patterns to Avoid

Based on **frontend-design** skill:

- ❌ **Generic fonts**: Inter, Roboto, Arial, system fonts
- ❌ **Cliched colors**: Purple gradients on white backgrounds
- ❌ **Predictable layouts**: Cookie-cutter component patterns
- ❌ **Direct styling**: `className="text-teal-600"` instead of `className="text-primary"`

---

## 📚 Resources

- **Global Design Agents** (`.claude/agents/`):
  - `universal-ui-designer.md` - Methodology
  - `design-system-generator.md` - Token generation
  - `frontend-design-workflow.md` - Workflow orchestration
  - `mobile-design-philosophy.md` - Mobile patterns

- **Implementation Files**:
  - `app/globals.css` - All semantic tokens and animations
  - `tailwind.config.ts` - Tailwind theme configuration

---

**Version**: 1.0
**Last Updated**: 2026-01-11
**Methodology**: Universal UI Designer + Frontend Design Workflow
