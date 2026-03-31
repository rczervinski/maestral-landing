# PROMPT PARA CLAUDE CODE — Ma&Stral Landing Page

---

Estou construindo uma landing page profissional para a **Ma&Stral**, empresa de soluções em reflorestamento, meio ambiente e agricultura (Paraná, Brasil). Tenho um HTML base do Google Stitch (`stitch-v2.html`) com a estrutura e textos que quero manter como referência.

## Arquivos já disponíveis na raiz do projeto

Já baixei tudo e deixei na raiz do projeto:

**Imagens (na raiz, mover para onde fizer sentido):**
- `hero-floresta.jpg` — foto de floresta com neblina (hero background)
- `servico-inventario.jpg` — inventário florestal
- `servico-licenciamento.jpg` — licenciamento ambiental
- `servico-topografico.jpg` — levantamento topográfico
- `servico-mapas.jpg` — elaboração de mapas
- `servico-pulverizacao.jpg` — pulverização com drones
- `servico-solidos.jpg` — distribuição de sólidos
- `drone-tech.jpg` — drone profissional (seção tecnologia)

**Modelo 3D (na raiz):**
- `pinus.glb` — modelo 3D de pinus para o hero, usar com `<model-viewer>` do Google

**HTML de referência (na raiz):**
- `stitch-v2.html` — HTML do Stitch, usar como referência de textos e estrutura. NÃO copiar o código dele, reconstruir do zero.

Organize esses arquivos na estrutura correta do projeto (mover imagens para `public/assets/images/`, modelo para `public/assets/models/`, etc).

## Objetivo

Criar um projeto Node.js hostável na Hostinger com código limpo, performático e produção-ready. O site deve parecer um projeto de R$5.000+, não template genérico de IA.

## Stack

- **Server:** Node.js + Express servindo arquivos estáticos
- **Frontend:** HTML/CSS/JS puro (SEM Tailwind CDN, SEM frameworks, SEM Material Icons CDN)
- **Fonts:** Google Fonts (Plus Jakarta Sans, Manrope, Space Grotesk)
- **3D:** Google model-viewer para o pinus GLB
- **Hospedagem:** Hostinger Node.js

## Estrutura do Projeto

```
maestral/
├── server.js              # Express servindo static files
├── package.json           # deps: express
├── public/
│   ├── index.html         # Landing page
│   ├── css/
│   │   └── style.css      # Todo o CSS customizado
│   ├── js/
│   │   └── main.js        # Animações e interações
│   └── assets/
│       ├── images/         # Todas as imagens .jpg
│       └── models/         # pinus.glb
└── stitch-v2.html         # Referência (não serve em produção)
```

## Identidade Visual

- **Logo SVG feita em código:** Pinus geométrico (3 camadas de triângulos escalonados + tronco retangular, cor verde #1B5E20) ao lado do texto "Ma" (branco), "&" (vermelho #C62828), "Stral" (teal #00838F). Sem "Florestal", sem telefone. A logo deve ser SVG inline no HTML, não imagem externa.
- **Paleta principal:** Fundo escuro (#0a0a0a a #131313), verde florestal (#1B5E20, #2E7D32), verde claro (#91d78a), vermelho (#C62828), teal (#00838F, #75d5e2)
- **Tipografia:** Plus Jakarta Sans peso 800 pra headlines, Manrope pra body text, Space Grotesk pra labels/badges — via Google Fonts com display=swap
- **Mood:** Natureza + Tecnologia de ponta. Cinematic, escuro, premium. Imagina se a Natura e a SpaceX fizessem um site juntos.

## Seções (na ordem)

### 1. Navbar
- Position fixed, background com glass morphism (rgba + backdrop-filter blur)
- Logo SVG inline (pinus geométrico + texto Ma&Stral colorido)
- Links âncora com smooth scroll: Serviços (#services), Tecnologia (#tech), Sobre (#about), Contato (#contact)
- Botão CTA "Fale Conosco" com ícone WhatsApp SVG real (não Material Icons, não emoji — usar o path SVG oficial do WhatsApp)
- Classe .scrolled adicionada via JS quando scrollY > 50 (escurece o fundo)
- Menu hambúrguer no mobile: botão ☰ que abre overlay fullscreen com links e CTA WhatsApp. Fecha com ✕ ou ao clicar num link.

### 2. Hero (SEÇÃO MAIS IMPORTANTE — caprichar aqui)
- min-height: 100vh, display flex center
- **Background:** imagem `hero-floresta.jpg` com opacity ~0.3, filtro saturação baixa, overlay gradient (transparent → rgba escuro → cor do body) para transição suave pro restante do site
- **Partículas:** 20-30 divs absolutas com border-radius 50%, cor verde claro, animação CSS drift (translateY para cima + translateX leve + opacity fade in/out), duração aleatória entre 6-14s, delay aleatório. Pointer-events none.
- **Badge pill:** inline-flex com glass morphism, bolinha verde pulsando (animation pulse), texto "Inovação Sustentável" em Space Grotesk uppercase tracking wide
- **H1:** "Transformamos o [quebra de linha] **futuro** do seu solo" — a palavra "futuro" deve ter efeito shimmer: background linear-gradient(90deg, verde → branco → verde), background-size 200%, background-clip text, text-fill-color transparent, animation 4s linear infinite movendo o background-position
- **Subtítulo:** "Soluções de alta precisão em reflorestamento, meio ambiente e agricultura com tecnologia de drones."
- **2 botões:** 
  - "Fale Conosco" — verde (#91d78a), texto escuro, ícone WhatsApp SVG, box-shadow glow, hover scale 1.05
  - "Explorar Soluções" — ghost/glass (fundo transparente com blur, borda branca sutil), href="#services"
- **Pinus 3D (model-viewer):** posicionado na parte inferior do hero ou como elemento decorativo lateral. Usar `<model-viewer>` carregando `assets/models/pinus.glb` com:
  - `auto-rotate` (rotação automática lenta)
  - `camera-controls` (usuário pode arrastar pra rotacionar)
  - `rotation-per-second="10deg"` (velocidade de rotação lenta e elegante)
  - `interaction-prompt="none"` (sem tooltip "arraste para girar")
  - `shadow-intensity="0"` (sem sombra no chão)
  - Background transparente
  - Posicionar com CSS de forma que não atrapalhe o texto mas dê um wow factor. Opções: canto inferior direito com tamanho grande mas opacity sutil, ou atrás do texto com mix-blend-mode, ou ao lado em telas grandes. Usar bom senso de design.
- **Animação de entrada:** Todos os elementos do hero com fadeInUp staggered (badge 0.2s delay → título 0.4s → subtítulo 0.6s → botões 0.8s), usando CSS animation com animation-fill-mode both

### 3. Carrossel de Clientes
- Título: "Empresas que confiam na Ma&Stral" em Space Grotesk uppercase tracking largo, cor cinza muted
- Fundo diferenciado (um tom de escuro diferente do hero e dos serviços, com border top e bottom sutil)
- Marquee infinito: container flex com overflow hidden, inner track com animation translateX(0) → translateX(-50%), linear, 35s, infinite. Itens duplicados pra loop seamless.
- 8 placeholders estilizados: caixas arredondadas (border-radius 1rem) com background sutil e texto "Cliente 01" a "Cliente 08" em Space Grotesk, opacity 0.5 default, opacity 1 + border verde no hover
- animation-play-state paused no hover do container

### 4. Serviços (id="services")
- Label verde: "Especialidades" em Space Grotesk uppercase
- Heading: "Nossa Atuação No Campo E Na Cidade." em Plus Jakarta Sans 800
- Texto auxiliar à direita no desktop: "Combinamos expertise ambiental com tecnologia de drones para entregar resultados cirúrgicos em cada projeto."
- Grid responsivo: 3 colunas desktop, 2 tablet, 1 mobile
- 6 cards com:
  - Imagem de fundo local (da pasta assets/images/), loading="lazy", object-fit cover
  - Overlay gradient (transparente no topo → escuro embaixo)
  - Emoji ícone grande
  - Título em Plus Jakarta Sans bold
  - Descrição curta (2 linhas max com line-clamp)
  - Hover: scale sutil (1.02), borda verde glow, barra verde 3px na esquerda do título (pseudo-element ::before com transition)
- Cards 2 e 5 com translateY: 2rem no desktop (padrão diagonal), resetar no mobile
- Scroll reveal (fade in up ao entrar na viewport)
- Mapeamento card → imagem:
  1. 🌲 Inventário Florestal → `servico-inventario.jpg`
  2. 📋 Licenciamento Ambiental → `servico-licenciamento.jpg`
  3. 📐 Levantamento Topográfico → `servico-topografico.jpg`
  4. 🗺️ Elaboração de Mapas → `servico-mapas.jpg`
  5. 🚁 Pulverização com Drones → `servico-pulverizacao.jpg`
  6. 📦 Distribuição de Sólidos → `servico-solidos.jpg`

### 5. Seção Drones/Tecnologia (id="tech")
- Fundo mais escuro (#0a0a0a) com grid pattern sutil (linhas verdes finas, opacity 0.08, feito com CSS background-image linear-gradient repetido)
- Layout flex 2 colunas, gap generoso (5rem). Stack no mobile.
- **Coluna esquerda (visual):**
  - Imagem `drone-tech.jpg` com border-radius 1.25rem e sombra forte
  - Frame decorativo: pseudo-elements ::before e ::after nos cantos opostos (top-left e bottom-right) com border parcial verde sutil
  - 2 stats flutuantes (position absolute):
    - "15k+ Hectares Mapeados" — glass panel (blur + rgba escuro + borda sutil), posição bottom-left
    - "500+ Projetos Ativos" — card sólido verde (#91d78a com texto escuro), posição top-right
  - **Counter animation:** os números começam em 0 e contam até o target quando a seção entra na viewport (IntersectionObserver + requestAnimationFrame com ease-out cúbico). Formatar: 15000 → "15k+", 500 → "500+"
  - **Tilt parallax:** a imagem do drone faz um tilt sutil baseado no scroll position (calcular diferença entre centro da imagem e centro da viewport, aplicar perspective + rotateX/Y de no máximo 3 graus)
- **Coluna direita (conteúdo):**
  - Eyebrow: "Precisão Aeroespacial" em Space Grotesk, cor teal, uppercase, tracking largo
  - Heading: "Voe Acima Dos Desafios Do Solo." em Plus Jakarta Sans 800
  - Parágrafo descritivo
  - 3 features em coluna com ícone emoji em caixa escura + título bold + descrição curta
  - Features: ⚡ Rapidez na Execução / 🔬 Análise Multiespectral / 🎯 Precisão Centimétrica

### 6. Sobre (id="about")
- **Fundo invertido:** cor clara (#e5e2e1), texto escuro
- Background com padrão topográfico SVG inline (curvas onduladas em teal, opacity 0.12)
- Layout grid: 5fr + 7fr desktop, 1fr mobile
- Heading: "Nascida Na Terra, Impulsionada Por Dados."
- 3 pillar cards brancos com border-top 3px verde, hover lift, shadow
- Card do meio com translateY offset no desktop
- 🌱 Reflorestamento / 🌍 Meio Ambiente / 🌾 Agricultura

### 7. CTA Final (id="contact")
- Card arredondado verde escuro (#1B5E20) com glow radial decorativo
- "Pronto para transformar seu projeto?" + botão WhatsApp grande (branco, texto verde escuro)

### 8. Footer
- Fundo #0a0a0a, border-radius 2rem no topo
- Logo + descrição + tagline verde
- Colunas Legal e Social
- Bottom: "© 2025 Ma&Stral. Todos os direitos reservados." + "Paraná, Brasil"

### 9. WhatsApp Flutuante
- Botão fixo inferior direito, #25D366, ícone WhatsApp SVG branco, hover scale

## Animações (main.js)

1. **Scroll Reveal:** IntersectionObserver (threshold 0.15), classe .visible, stagger delay nos filhos
2. **Shimmer text:** CSS puro
3. **Partículas:** JS gera divs, CSS anima
4. **Counter:** IntersectionObserver + rAF + ease-out cúbico
5. **Drone tilt:** scroll listener passive, perspective transform
6. **Marquee:** CSS translateX infinito
7. **Navbar scroll:** classe .scrolled
8. **Mobile menu:** toggle classe .open

## WhatsApp — TODOS os CTAs

```
https://wa.me/5541991511406?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20serviços%20da%20Ma%26Stral.
```

## server.js

```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Ma&Stral rodando na porta ${PORT}`);
});
```

## Dependência externa permitida

O `<model-viewer>` precisa de:
```html
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
```
É a única dependência externa além do Google Fonts.

## Regras

1. SEM Tailwind CDN — CSS puro com variáveis CSS
2. SEM frameworks JS — vanilla JavaScript
3. SEM Material Icons — emojis ou SVG inline
4. SEM imagens externas — tudo de assets/
5. Mobile-first, breakpoints 768px e 1024px
6. loading="lazy" nas imagens, fonts display=swap
7. SEO: metas, alts, semântica HTML5
8. aria-labels, rel="noopener" nos target="_blank"
9. Tudo em português brasileiro
10. Código bem comentado pra eu fazer vibe coding depois

## Primeiro passo

1. Mover arquivos da raiz → estrutura correta
2. Criar server.js e package.json
3. Construir index.html + style.css + main.js
4. Testar com `node server.js`