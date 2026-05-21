# DESIGN — Ma&Stral

## Color strategy
**Committed**, dominado por verde-pinus profundo. O verde vivo da logo (`#31D53B` / `oklch(75% 0.190 142)`) é acento, máximo 10% da superfície. Sem verde mint, sem neon, sem glow.

### Tokens (OKLCH)
| token        | OKLCH                      | uso |
|--------------|----------------------------|-----|
| canvas       | `oklch(98% 0.005 110)`     | fundo principal claro, "papel" |
| canvas-2     | `oklch(95% 0.010 105)`     | seções alternadas |
| ink          | `oklch(22% 0.015 150)`     | texto principal |
| ink-soft     | `oklch(42% 0.020 150)`     | texto secundário |
| forest       | `oklch(28% 0.060 155)`     | dominante (hero, tech, footer); 40% da superfície total |
| forest-2     | `oklch(38% 0.080 150)`     | hover/detalhe sobre forest |
| moss         | `oklch(58% 0.050 145)`     | labels neutros, divisores |
| leaf         | `oklch(75% 0.190 142)`     | acento (verde da logo), `≤10%` |
| clay         | `oklch(58% 0.090 65)`      | terra, doses pequenas |
| line         | `oklch(88% 0.012 110)`     | bordas/divisores |

## Typography
**Single family: Bricolage Grotesque** (variable, opentype rico, eixos `wght 300-800` e `wdth 75-100`). Único família no site inteiro. Hierarquia por peso, largura e tamanho.

- Display (`clamp(2rem, 4-7vw, 7rem)`) weight 300 + 500, tracking `-0.025em`.
- Body 16-20px weight 400, tracking neutro.
- Labels/eyebrows: 12-14px weight 400, sem uppercase, sem tracking aberto. Tipo: `01 / Reflorestamento` (número index + barra).
- Itálico aparece **apenas** em um par de palavras-âncora por seção. Não decora copy.
- `font-variant-numeric: tabular-nums` em qualquer número.

## Layout system
- Container max-width `1400px`, padding lateral `clamp(1.5rem, 4vw, 2.5rem)`.
- Grid base 12 colunas, gap 6 (1.5rem).
- Asymmetric, left-aligned por padrão. Nunca centrado por reflexo.
- Densidade vertical: `py-24 md:py-32` por seção. Sem ar em excesso.
- Listagens longas (serviços, pilares, KPIs do tech) usam `divide-y` ou `divide-x`, não cards.

## Componentes / patterns
- **Eyebrow**: `<p class="text-moss text-sm mb-4">01 / Atuação</p>`. Nunca uppercase, nunca tracking-widest.
- **CTA primário**: `bg-forest text-canvas rounded-full px-6 py-3`. Hover muda para `bg-ink` (sem scale).
- **CTA acento**: `bg-leaf text-forest rounded-full`. Apenas no hero estágio 1.
- **Link inline**: `border-b border-ink/20 hover:border-ink pb-1`, sem underline-offset extravagante.
- **Numbered index** (serviços, pilares, cases): número tabular em coluna fixa, sem círculo, sem badge.
- **Tabela tipográfica**: KPIs viram `<dl>` com divisores horizontais, nunca cards com sombra.

## Motion
- Lenis para smooth scroll global.
- GSAP ScrollTrigger orquestra o hero 3D em três estágios numa seção de 360vh com sticky child.
- `scrub: 0.8` para amarrar transformações 3D ao scroll.
- Easings: `power1.out`, `power2.inOut`, `power2.out`. Nunca elastic, nunca bounce.
- Sem hover scale, sem float, sem shimmer.
- `prefers-reduced-motion`: 3D escondido, fallback estático.

## 3D scene
- `pinus.glb` instanciado via `THREE.InstancedMesh` (60 instâncias desktop / 28 mobile).
- Distribuição polar com clearing no centro frontal para o headline respirar.
- 1 árvore standalone "hero" começa fora de quadro e desliza para o foreground no terceiro estágio.
- `THREE.FogExp2` cor `#0c2418` colapsa o fundo.
- 3 luzes: hemisphere ground+sky, directional sun warm, rim verde fraco.

## Imagery direction
Fotografia documental, lente fixa 35-50mm, ISO baixo, luz natural (manhã ou final de tarde). Inclui pessoas (trabalhadores, equipamento) e clima (neblina, sombra de nuvem, terra molhada). Nunca: drama cinematográfico, lens flare, paleta supersaturada, simetria perfeita, "epic shot".

## Banidas (operacional)
- `tracking-widest`, `uppercase` em parágrafos ou eyebrows
- `text-transparent bg-clip-text` (gradient text)
- `backdrop-blur` decorativo (apenas no header com leveza)
- `hover:scale-*`
- `border-l-4 border-leaf` (side-stripe accents)
- `shadow-[0_0_30px_rgba(...)]` (glow neon)
- Card grid uniforme repetido (≥4 cards idênticos)
- Material Symbols Outlined em qualquer lugar
