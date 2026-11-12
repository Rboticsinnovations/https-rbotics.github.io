import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { PUBLIC_PAGES, SITE_URL } from './src/data/servicesData'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const canonical = (p: string) => (p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}/`)

/**
 * SEO files for GitHub Pages (a static host):
 * - <page>/index.html for every public route, with that page's title/description/canonical,
 *   so /products and /services/... return 200 (not 404) and crawlers see the right tags
 * - 404.html so any other URL still loads the app
 * - sitemap.xml and robots.txt generated from the same page list
 */
const seoPages = (): Plugin => {
  let outDir = 'docs'
  return {
    name: 'rbotics-seo-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    // writeBundle runs after index.html has been written to disk (closeBundle can run earlier)
    writeBundle() {
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')

      const render = (page: (typeof PUBLIC_PAGES)[number]) => {
        const title = escapeHtml(page.title)
        const desc = escapeHtml(page.description)
        const url = canonical(page.path)
        return template
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`)
      }

      for (const page of PUBLIC_PAGES) {
        const file = page.path === '/'
          ? path.join(outDir, 'index.html')
          : path.join(outDir, page.path, 'index.html')
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, render(page))
      }

      // Unknown URLs: load the app (it redirects home) but keep them out of Google
      fs.writeFileSync(
        path.join(outDir, '404.html'),
        template.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex" />'),
      )

      const today = new Date().toISOString().slice(0, 10)
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...PUBLIC_PAGES.map(p => `  <url><loc>${canonical(p.path)}</loc><lastmod>${today}</lastmod></url>`),
        '</urlset>',
        '',
      ].join('\n')
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)

      fs.writeFileSync(
        path.join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPages()],
  build: {
    // GitHub Pages serves the site from /docs at the repo root.
    outDir: 'docs',
  },
  server: {
    // In development, forward /api calls to the backend so no CORS or cookie setup is needed.
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:5001',
    },
  },
})
