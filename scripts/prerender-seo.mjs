import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const seo = JSON.parse(await readFile(join(root, 'src', 'data', 'seo.json'), 'utf8'))
const template = await readFile(join(dist, 'index.html'), 'utf8')
const routes = Object.entries(seo.routes)

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function absolute(path) {
  return new URL(path, seo.siteUrl).toString()
}

function replaceMeta(html, attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s+content="[^"]*"\\s*/?>`)
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function schemaFor(path, entry) {
  const canonical = absolute(path)
  const pageImage = absolute(entry.image || seo.defaultImage)
  const organization = {
    '@type': 'Organization', '@id': `${seo.siteUrl}/#organization`, name: seo.siteName, url: `${seo.siteUrl}/`,
    logo: { '@type': 'ImageObject', url: `${seo.siteUrl}/favicon-512.png`, width: 512, height: 512 },
    email: 'hello@salyior.com', description: seo.routes['/'].description, areaServed: 'Worldwide',
    knowsAbout: ['Web design', 'Frontend development', 'Conversion strategy', 'Technical SEO'],
  }
  const website = {
    '@type': 'WebSite', '@id': `${seo.siteUrl}/#website`, url: `${seo.siteUrl}/`, name: seo.siteName,
    publisher: { '@id': `${seo.siteUrl}/#organization` }, inLanguage: 'en',
  }
  const webpage = {
    '@type': entry.schema === 'collection' ? 'CollectionPage' : entry.schema === 'contact' ? 'ContactPage' : 'WebPage',
    '@id': `${canonical}#webpage`, url: canonical, name: entry.title, description: entry.description,
    isPartOf: { '@id': `${seo.siteUrl}/#website` }, about: { '@id': `${seo.siteUrl}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: pageImage }, inLanguage: 'en',
  }
  const graph = [organization, website, webpage]

  if (path !== '/') {
    const parts = path.split('/').filter(Boolean)
    const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${seo.siteUrl}/` }]
    if (parts[0] === 'work' && parts.length > 1) items.push({ '@type': 'ListItem', position: 2, name: 'Work', item: `${seo.siteUrl}/work` })
    items.push({ '@type': 'ListItem', position: items.length + 1, name: entry.label, item: canonical })
    graph.push({ '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: items })
  }
  if (entry.schema === 'home' || entry.schema === 'service') {
    graph.push({
      '@type': 'Service', '@id': `${seo.siteUrl}/services#service`, name: 'Custom web design and development',
      description: seo.routes['/services'].description, provider: { '@id': `${seo.siteUrl}/#organization` },
      areaServed: 'Worldwide', serviceType: ['Web design', 'Frontend development', 'Technical SEO', 'Conversion direction'],
    })
  }
  if (entry.schema === 'case-study') {
    graph.push({
      '@type': 'CreativeWork', '@id': `${canonical}#case-study`, name: entry.label, description: entry.description,
      url: canonical, image: pageImage, creator: { '@id': `${seo.siteUrl}/#organization` },
      mainEntityOfPage: { '@id': `${canonical}#webpage` }, sameAs: entry.liveUrl, inLanguage: 'en',
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

const titles = new Set()
const descriptions = new Set()
for (const [path, entry] of routes) {
  if (titles.has(entry.title) || descriptions.has(entry.description)) throw new Error(`Duplicate SEO metadata detected for ${path}`)
  if (entry.index && (entry.title.length < 30 || entry.title.length > 65)) throw new Error(`SEO title length is outside the guardrail for ${path}`)
  if (entry.index && (entry.description.length < 70 || entry.description.length > 170)) throw new Error(`Meta description length is outside the guardrail for ${path}`)
  titles.add(entry.title)
  descriptions.add(entry.description)

  const canonical = absolute(path)
  const robots = entry.index
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, follow'
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(entry.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<script id="seo-schema" type="application\/ld\+json">[\s\S]*?<\/script>/, `<script id="seo-schema" type="application/ld+json">${JSON.stringify(schemaFor(path, entry))}</script>`)

  if (entry.schema === 'case-study' && entry.image) {
    const compactImage = entry.image.replace(/\.webp$/, '-640.webp')
    const smallImage = entry.image.replace(/\.webp$/, '-800.webp')
    html = html.replace(/<link id="primary-image-preload"[^>]+\/>/, `<link id="primary-image-preload" rel="preload" as="image" href="${compactImage}" type="image/webp" fetchpriority="high" imagesrcset="${compactImage} 640w, ${smallImage} 800w, ${entry.image} 1600w" imagesizes="(max-width: 767px) calc(100vw - 38px), (max-width: 1100px) calc(100vw - 48px), 1240px" />`)
  } else if (path !== '/') {
    html = html.replace(/\s*<link id="primary-image-preload"[^>]+\/>/, '')
  }

  html = replaceMeta(html, 'name', 'description', entry.description)
  html = replaceMeta(html, 'name', 'robots', robots)
  html = replaceMeta(html, 'name', 'googlebot', robots)
  html = replaceMeta(html, 'property', 'og:type', entry.schema === 'case-study' ? 'article' : 'website')
  html = replaceMeta(html, 'property', 'og:title', entry.title)
  html = replaceMeta(html, 'property', 'og:description', entry.description)
  html = replaceMeta(html, 'property', 'og:url', canonical)
  html = replaceMeta(html, 'property', 'og:image:alt', `${entry.label} — SALYIOR`)
  html = replaceMeta(html, 'name', 'twitter:title', entry.title)
  html = replaceMeta(html, 'name', 'twitter:description', entry.description)
  html = replaceMeta(html, 'name', 'twitter:image:alt', `${entry.label} — SALYIOR`)

  if (path === '/') {
    await writeFile(join(dist, 'index.html'), html)
  } else {
    const output = join(dist, `${path.slice(1)}.html`)
    await mkdir(dirname(output), { recursive: true })
    await writeFile(output, html)
  }
}

console.log(`Generated route metadata for ${routes.length} pages.`)
