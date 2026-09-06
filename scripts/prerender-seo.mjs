import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const origin = 'https://salyior.com'
const languages = ['en', 'ka', 'ru']
const projects = ['arqi-georgia', 'kristina-languages', 'sama', 'arrive', 'inkognito', 'lajele', 'artcrimes', 'esthetic-rolls', 'aura-coffee']
const services = ['websites', 'seo', 'web-apps', 'bookings-integrations']
const routes = ['', '/work', '/solutions', ...services.map(slug => `/solutions/${slug}`), '/process', '/pricing', '/about', '/web-design-batumi', '/web-design-tbilisi', '/contact', '/privacy', ...projects.map(slug => `/work/${slug}`)]

const seo = {
  en: {
    home: ['Web Design & Web App Development in Batumi | SALYIOR', 'Web design, websites and web application development for businesses in Batumi, Tbilisi and across Georgia. Fast, multilingual and built for enquiries.'],
    batumi: ['Web Design in Batumi, Georgia | SALYIOR', 'Local web design, development and multilingual SEO for hotels, restaurants, property businesses and growing teams in Batumi.'],
    tbilisi: ['Web Design in Tbilisi, Georgia | SALYIOR', 'Web design, development and multilingual SEO for ambitious businesses and growing teams in Tbilisi.'],
  },
  ka: {
    home: ['ვებდიზაინი და ვებაპლიკაციები ბათუმში | SALYIOR', 'ვებდიზაინი, ვებსაიტები და ვებაპლიკაციები ბათუმის, თბილისის და მთელი საქართველოს ბიზნესებისთვის. სწრაფი, მრავალენოვანი და მომართვებზე ორიენტირებული.'],
    batumi: ['ვებდიზაინი ბათუმში | SALYIOR', 'ლოკალური ვებდიზაინი, დეველოპმენტი და მრავალენოვანი SEO ბათუმის ბიზნესებისთვის.'],
    tbilisi: ['ვებდიზაინი თბილისში | SALYIOR', 'ვებდიზაინი, დეველოპმენტი და მრავალენოვანი SEO თბილისის ბიზნესებისთვის.'],
  },
  ru: {
    home: ['Веб-дизайн и веб-приложения в Батуми | SALYIOR', 'Веб-дизайн, сайты и веб-приложения для бизнеса в Батуми, Тбилиси и по всей Грузии. Быстро, на трёх языках и с фокусом на заявки.'],
    batumi: ['Веб-дизайн в Батуми, Грузия | SALYIOR', 'Локальный веб-дизайн, разработка и многоязычное SEO для бизнеса в Батуми.'],
    tbilisi: ['Веб-дизайн в Тбилиси, Грузия | SALYIOR', 'Веб-дизайн, разработка и многоязычное SEO для бизнеса в Тбилиси.'],
  },
}

const labels = {
  work: { en: 'Web Design Portfolio', ka: 'ვებდიზაინის პორტფოლიო', ru: 'Портфолио веб-дизайна' },
  solutions: { en: 'Web Design, Development & SEO Services', ka: 'ვებდიზაინი, დეველოპმენტი და SEO', ru: 'Веб-дизайн, разработка и SEO' },
  process: { en: 'Website Design Process', ka: 'ვებსაიტის შექმნის პროცესი', ru: 'Процесс создания сайта' },
  pricing: { en: 'Website Pricing', ka: 'ვებსაიტის ფასები', ru: 'Цены на сайты' },
  about: { en: 'Web Studio in Batumi', ka: 'ვებსტუდია ბათუმში', ru: 'Веб-студия в Батуми' },
  contact: { en: 'Discuss Your Website Project', ka: 'განიხილეთ თქვენი ვებსაიტის პროექტი', ru: 'Обсудить ваш сайт' },
  privacy: { en: 'Privacy', ka: 'კონფიდენციალურობა', ru: 'Конфиденциальность' },
}

const serviceMeta = {
  websites: {
    en: ['Business Website Design in Georgia', 'Custom, mobile-ready business websites designed to build trust, explain your offer and turn visitors into enquiries.'],
    ka: ['ბიზნეს ვებსაიტების შექმნა საქართველოში', 'ინდივიდუალური, მობილურზე მორგებული ბიზნეს ვებსაიტები ნდობის, მკაფიო შეთავაზებისა და ახალი მომართვებისთვის.'],
    ru: ['Создание сайтов для бизнеса в Грузии', 'Индивидуальные адаптивные сайты, которые вызывают доверие, понятно представляют бизнес и приносят заявки.'],
  },
  seo: {
    en: ['SEO & Website Performance in Georgia', 'Search-ready website structure, local SEO foundations and fast loading for businesses in Batumi, Tbilisi and across Georgia.'],
    ka: ['SEO და ვებსაიტის სისწრაფე საქართველოში', 'ძიებისთვის მომზადებული სტრუქტურა, ლოკალური SEO და სწრაფი ჩატვირთვა ბათუმის, თბილისის და საქართველოს ბიზნესებისთვის.'],
    ru: ['SEO и скорость сайта в Грузии', 'Структура под поиск, локальная SEO-основа и быстрая загрузка для бизнеса в Батуми, Тбилиси и по всей Грузии.'],
  },
  'web-apps': {
    en: ['Custom Web App Development in Georgia', 'Custom portals, dashboards and browser-based tools built around your customers, team and business workflow.'],
    ka: ['ინდივიდუალური ვებაპლიკაციების შექმნა საქართველოში', 'ინდივიდუალური პორტალები, დაფები და ბრაუზერული ხელსაწყოები თქვენი მომხმარებლების, გუნდისა და სამუშაო პროცესისთვის.'],
    ru: ['Разработка веб-приложений в Грузии', 'Индивидуальные порталы, панели и браузерные инструменты для клиентов, команды и процессов вашего бизнеса.'],
  },
  'bookings-integrations': {
    en: ['Online Bookings & Website Integrations', 'Booking calendars, catalogues, payment connections and useful integrations that let customers act at any time.'],
    ka: ['ონლაინ ჯავშნები და ვებსაიტის ინტეგრაციები', 'დაჯავშნის კალენდრები, კატალოგები, გადახდები და სასარგებლო ინტეგრაციები, რომლებიც მომხმარებლებს ნებისმიერ დროს მოქმედების საშუალებას აძლევს.'],
    ru: ['Онлайн-бронирование и интеграции сайта', 'Календари бронирования, каталоги, платежи и полезные интеграции, доступные клиентам в любое время.'],
  },
}

function escape(value) { return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;') }
function pageMeta(language, path) {
  if (!path) return seo[language].home
  if (path === '/web-design-batumi') return seo[language].batumi
  if (path === '/web-design-tbilisi') return seo[language].tbilisi
  if (path.startsWith('/solutions/')) { const service=path.split('/').pop(); return serviceMeta[service]?.[language] || seo[language].home }
  if (path.startsWith('/work/')) { const name=path.split('/').pop().replaceAll('-', ' '); return [`${name.replace(/\b\w/g, char=>char.toUpperCase())} | SALYIOR`, seo[language].home[1]] }
  const key=path.slice(1); return [`${labels[key]?.[language] || 'SALYIOR'} | SALYIOR`, seo[language].home[1]]
}

for (const language of languages) for (const path of routes) {
  const [title, description] = pageMeta(language, path)
  const canonical = `${origin}/${language}${path}`
  const alternates = languages.map(code => `<link rel="alternate" hreflang="${code}" href="${origin}/${code}${path}" data-salyior-hreflang="true" />`).join('\n    ')
  let html = template
    .replace('<html lang="en">', `<html lang="${language}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escape(description)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escape(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escape(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]+data-salyior-hreflang="true"\s*\/>/g, '')
    .replace('</head>', `    ${alternates}\n    <link rel="alternate" hreflang="x-default" href="${origin}/en${path}" data-salyior-hreflang="true" />\n  </head>`)
  const output = join(dist, language, path.slice(1), 'index.html')
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, html)
}

console.log(`Generated localized metadata for ${routes.length * languages.length} URLs.`)
