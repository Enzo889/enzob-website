# Enzo Bustamante

## Portfolio Site

✨ This is the source code for my personal portfolio, accessible at [enzobustamante.com](https://enzobustamante.com). Built with a focus on minimalism, smooth interactions, and multi-language support.

## 🚀 Tech Stack

- **Framework**: [Astro 6](https://astro.build/) (Static Site Generation)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion v12](https://motion.dev/) & [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **Content**: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) with MDX
- **Fonts**: Newsreader, Inter, Outfit, Montserrat, Fuzzy Bubbles, Short Stack
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Creative Coding**: [p5.js](https://p5js.org/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## ✨ Key Features

- 🌐 **Multi-language Support (i18n)**: Full support for Spanish (default), English, and Brazilian Portuguese.
- 🎨 **Modern Design System**: Carefully curated typography and a sleek, responsive UI.
- ⚡ **Optimized Performance**: Zero JavaScript by default, with minimal interactive islands.
- 📖 **Craft & Notes**: Dedicated sections for experimental creative coding and technical writing.
- 🎭 **Smooth Transitions**: Using Astro's `ClientRouter` for a seamless SPA-like feel.

## 🛠️ Local Development

Ensure you have [Bun](https://bun.sh/) installed.

```bash
# Install dependencies
bun install

# Start the development server
bun dev

# Build for production
bun build

# Preview the production build
bun preview
```

## 📂 Project Structure

```text
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── pages/       # Shared page templates
│   │   └── shared/      # UI primitives (Logo, Background, Nav)
│   ├── content/         # MDX notes and projects
│   ├── i18n/            # Translation files (ES, EN, BR)
│   ├── layout/          # Main page layouts
│   ├── pages/           # Route definitions
│   ├── styles/          # Global CSS and Tailwind configuration
│   └── utils/           # Helper functions (i18n, formatters)
├── public/              # Static assets (fonts, images, favicons)
└── astro.config.mjs     # Astro configuration
```

## 📜 License

This project is personal and all rights are reserved. You are free to use it as an inspiration for your own portfolio, but please do not copy the content or the specific design identity as is.

---

Built with ❤️ by [Enzo Bustamante](https://enzobustamante.com).
