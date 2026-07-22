import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import seo from '../data/seo.json'

type SeoEntry = {
  title: string
  description: string
  label: string
  schema: string
  index: boolean
  image?: string
  liveUrl?: string
}

const routes = seo.routes as Record<string, SeoEntry>
const fallback: SeoEntry = {
  title: 'Page not found | SALYIOR',
  description: 'The requested page could not be found.',
  label: 'Page not found',
  schema: 'not-found',
  index: false,
}

function absoluteUrl(path: string) {
  return new URL(path, seo.siteUrl).toString()
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function createSchema(path: string, entry: SeoEntry) {
  const canonical = absoluteUrl(path === '/' ? '/' : path)
  const image = absoluteUrl(entry.image || seo.defaultImage)
  const organization = {
    '@type': 'Organization',
    '@id': `${seo.siteUrl}/#organization`,
    name: seo.siteName,
    url: `${seo.siteUrl}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${seo.siteUrl}/favicon-512.png`,
      width: 512,
      height: 512,
    },
    email: 'hello@salyior.com',
    description: routes['/'].description,
    areaServed: 'Worldwide',
    knowsAbout: ['Web design', 'Frontend development', 'Conversion strategy', 'Technical SEO'],
  }
  const website = {
    '@type': 'WebSite',
    '@id': `${seo.siteUrl}/#website`,
    url: `${seo.siteUrl}/`,
    name: seo.siteName,
    publisher: { '@id': `${seo.siteUrl}/#organization` },
    inLanguage: 'en',
  }
  const webpage: Record<string, unknown> = {
    '@type': entry.schema === 'collection' ? 'CollectionPage' : entry.schema === 'contact' ? 'ContactPage' : 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: entry.title,
    description: entry.description,
    isPartOf: { '@id': `${seo.siteUrl}/#website` },
    about: { '@id': `${seo.siteUrl}/#organization` },
    primaryImageOfPage: { '@type': 'ImageObject', url: image },
    inLanguage: 'en',
  }
  const graph: Record<string, unknown>[] = [organization, website, webpage]

  if (path !== '/') {
    const parts = path.split('/').filter(Boolean)
    const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${seo.siteUrl}/` }]
    if (parts[0] === 'work' && parts.length > 1) {
      items.push({ '@type': 'ListItem', position: 2, name: 'Work', item: `${seo.siteUrl}/work` })
    }
    items.push({ '@type': 'ListItem', position: items.length + 1, name: entry.label, item: canonical })
    graph.push({ '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: items })
  }

  if (entry.schema === 'home' || entry.schema === 'service') {
    graph.push({
      '@type': 'Service',
      '@id': `${seo.siteUrl}/services#service`,
      name: 'Custom web design and development',
      description: routes['/services'].description,
      provider: { '@id': `${seo.siteUrl}/#organization` },
      areaServed: 'Worldwide',
      serviceType: ['Web design', 'Frontend development', 'Technical SEO', 'Conversion direction'],
    })
  }

  if (entry.schema === 'case-study') {
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${canonical}#case-study`,
      name: entry.label,
      description: entry.description,
      url: canonical,
      image,
      creator: { '@id': `${seo.siteUrl}/#organization` },
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
      sameAs: entry.liveUrl,
      inLanguage: 'en',
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function PageMetadata() {
  const location = useLocation()

  useEffect(() => {
    const normalizedPath = location.pathname !== '/' ? location.pathname.replace(/\/$/, '') : '/'
    const entry = routes[normalizedPath] || fallback
    const canonical = absoluteUrl(normalizedPath === '/' ? '/' : normalizedPath)
    const socialImage = absoluteUrl(seo.defaultImage)
    const robots = entry.index
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : 'noindex, follow'

    document.title = entry.title
    document.documentElement.lang = 'en'

    upsertMeta('meta[name="description"]', 'name', 'description', entry.description)
    upsertMeta('meta[name="robots"]', 'name', 'robots', robots)
    upsertMeta('meta[name="googlebot"]', 'name', 'googlebot', robots)
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', entry.schema === 'case-study' ? 'article' : 'website')
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', entry.title)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', entry.description)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', socialImage)
    upsertMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', `${entry.label} — SALYIOR`)
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', entry.title)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', entry.description)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', socialImage)
    upsertMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', `${entry.label} — SALYIOR`)

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonicalElement) {
      canonicalElement = document.createElement('link')
      canonicalElement.rel = 'canonical'
      document.head.appendChild(canonicalElement)
    }
    canonicalElement.href = canonical

    let schemaElement = document.head.querySelector<HTMLScriptElement>('#seo-schema')
    if (!schemaElement) {
      schemaElement = document.createElement('script')
      schemaElement.id = 'seo-schema'
      schemaElement.type = 'application/ld+json'
      document.head.appendChild(schemaElement)
    }
    schemaElement.textContent = JSON.stringify(createSchema(normalizedPath, entry))
  }, [location.pathname])

  return null
}
