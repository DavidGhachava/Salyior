import type { FAQ, Outcome, Principle, ProcessStage, Project } from '../types'

export const navigation = [
  { label: 'Work', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'Studio', href: '/#studio' },
  { label: 'Process', href: '/#process' },
  { label: 'FAQ', href: '/#faq' },
]

export const projects: Project[] = [
  {
    slug: 'arqi-georgia',
    number: '01',
    title: 'ARQI Georgia',
    type: 'Independent build',
    industry: 'Real estate',
    summary:
      'A multi-page private property advisory experience for architecturally significant homes, land and restoration opportunities across Georgia.',
    commercialGoal: 'Present rare properties with restraint while creating clear routes into collection browsing, private search and qualified enquiries.',
    problem: 'High-value property needs more context and trust than a conventional listings grid can provide.',
    solution: 'An editorial system combining a curated collection, detailed property routes, private search, studio positioning, journal content and a focused enquiry path.',
    result: 'A complete editorial real-estate experience with a deliberately small collection and multiple ways for serious buyers to continue the conversation.',
    services: ['Strategy', 'UI/UX', 'Development'],
    visual: 'arqi',
    image: '/projects/arqi.webp',
    imageAlt: 'ARQI Georgia property advisory homepage overlooking Mount Kazbek',
    imageWidth: 1600,
    imageHeight: 910,
    url: 'https://arql.netlify.app/',
    featured: true,
  },
  {
    slug: 'arrive-city-guides',
    number: '02',
    title: 'Arrive',
    type: 'Independent build',
    industry: 'Tourism',
    summary:
      'A city-arrival guide that helps travellers make calmer first-hour decisions across Ljubljana, Vienna and Zagreb.',
    commercialGoal: 'Bring transport, accommodation, food, attractions, money, safety and local essentials into one useful arrival experience.',
    problem: 'The practical information a traveller needs after landing is usually fragmented across maps, blogs and outdated search results.',
    solution: 'A searchable, saveable city-guide product with city routes, travel-mood filters, transport comparisons, emergency information, local phrases and source-verification notes.',
    result: 'A working web experience structured to grow into a PWA as more cities and real-time information sources are added.',
    services: ['Product direction', 'UI/UX', 'Frontend'],
    visual: 'arrive',
    image: '/projects/arrive.webp',
    imageAlt: 'Arrive city guide homepage for travellers entering a new city',
    imageWidth: 1600,
    imageHeight: 904,
    url: 'https://guiderp.netlify.app/',
    featured: true,
  },
  {
    slug: 'kristina-languages',
    number: '03',
    title: 'Kristina Languages',
    type: 'Client project',
    industry: 'Education',
    summary:
      'A Russian-language acquisition website for Georgian tutor Kristina Beridze, serving children and adults in Batumi and online.',
    commercialGoal: 'Help local learners discover Kristina through search, understand the lesson formats and move confidently into an inquiry.',
    problem: 'Kristina needed a credible online presence that explained her teaching approach and made her visible to Russian-speaking learners in the local market.',
    solution: 'A focused, SEO-structured PWA with clear lesson formats, Batumi positioning, transparent pricing, WhatsApp actions and a qualified lesson application.',
    result: 'The online presence contributed to real student discovery and enrolment without relying on invented performance claims or inflated metrics.',
    services: ['Conversion design', 'Local SEO', 'PWA development'],
    visual: 'kristina',
    image: '/projects/kristina-languages.webp',
    imageAlt: 'Kristina Beridze Georgian tutor website homepage',
    imageWidth: 1600,
    imageHeight: 896,
    url: 'https://www.kristinalanguages.com/',
    featured: true,
  },
]

export const outcomes: Outcome[] = [
  {
    number: '01',
    title: 'Turn attention into reservations.',
    description:
      'Give guests the information and confidence they need, then make the next available action unmistakably clear.',
    visual: 'booking',
  },
  {
    number: '02',
    title: 'Make valuable properties easier to discover.',
    description:
      'Structure listings around real search behavior so the right property can be found, understood and acted on quickly.',
    visual: 'search',
  },
  {
    number: '03',
    title: 'Build trust before the first conversation.',
    description:
      'Use strong presentation, useful detail and consistent interaction to make the business feel credible before contact.',
    visual: 'trust',
  },
  {
    number: '04',
    title: 'Create a faster path from interest to action.',
    description:
      'Remove avoidable decisions and dead ends between a visitor landing on the site and making a valuable inquiry.',
    visual: 'contact',
  },
]

export const principles: Principle[] = [
  {
    number: '01',
    title: 'Strategy before screens',
    description:
      'We define the visitor, their questions and the highest-value action before choosing visual details.',
  },
  {
    number: '02',
    title: 'Custom direction',
    description:
      'Each website is designed around the business, audience and offer instead of forcing content into a template.',
  },
  {
    number: '03',
    title: 'Mobile-first execution',
    description:
      'The mobile journey is treated as the primary experience, not a reduced desktop version.',
  },
  {
    number: '04',
    title: 'Built beyond launch',
    description:
      'Performance, SEO foundations, analytics and ongoing care are considered from the beginning.',
  },
]

export const processStages: ProcessStage[] = [
  {
    number: '01',
    title: 'Discover',
    description: 'Understand the business, audience, goals, current friction and required functionality.',
  },
  {
    number: '02',
    title: 'Direction',
    description: 'Define the sitemap, conversion path, content hierarchy and visual direction.',
  },
  {
    number: '03',
    title: 'Design and build',
    description: 'Create the responsive interface and develop the complete website system.',
  },
  {
    number: '04',
    title: 'Review and launch',
    description: 'Test, refine, connect analytics, configure technical SEO and publish.',
  },
  {
    number: '05',
    title: 'Improve',
    description: 'Provide post-launch checks and optional ongoing SALYIOR Care support.',
  },
]

export const faqs: FAQ[] = [
  {
    question: 'What types of businesses does SALYIOR work with?',
    answer:
      'SALYIOR focuses on hospitality, real estate, tourism and adjacent businesses where discovery, trust and a clear next action directly affect revenue.',
  },
  {
    question: 'How much does a website cost?',
    answer:
      'Custom websites begin at $500. The final quote depends on the required pages, content, integrations and functionality, and is agreed before work begins.',
  },
  {
    question: 'How long does a project usually take?',
    answer:
      'A focused landing page can move quickly, while a multi-page or custom build takes longer. Your proposal will include a realistic schedule based on scope and response speed.',
  },
  {
    question: 'What do I need to provide?',
    answer:
      'Usually your business information, existing brand assets, photography, required functionality and timely feedback. SALYIOR will make the exact list clear at the start.',
  },
  {
    question: 'Are revisions included?',
    answer:
      'Yes. The scope and number of structured revision rounds are defined in the proposal so both sides know how review and approval will work.',
  },
  {
    question: 'Will I own my website and domain?',
    answer:
      'Yes. You retain ownership of your domain, accounts, data and final paid deliverables. Any third-party licenses or subscriptions are documented clearly.',
  },
  {
    question: 'Can SALYIOR redesign an existing website?',
    answer:
      'Yes. The first step is understanding what should be preserved, what currently creates friction and what the new website needs to achieve.',
  },
  {
    question: 'Do you offer support after launch?',
    answer:
      'Yes. SALYIOR Care covers managed hosting, routine monitoring, maintenance and a small monthly content allowance for $59 per month.',
  },
  {
    question: 'Can you build payments, booking systems or property filters?',
    answer:
      'Yes, where the project requires them. Complex integrations, payments, booking, CMS functionality and advanced filters receive a custom technical scope and quote.',
  },
  {
    question: 'Can a website also work like an installable app?',
    answer:
      'Yes. Advanced website builds can include an installable home-screen experience, offline functionality and opt-in notifications where they serve a real customer need. Installation and notification behavior varies by device, and customers always control notification permission.',
  },
  {
    question: 'Do you work internationally?',
    answer:
      'Yes. SALYIOR is a remote studio working with businesses worldwide. Communication, reviews and delivery are structured for focused remote collaboration.',
  },
]

export const budgetOptions = ['$500–$800', '$800–$1,500', '$1,500–$3,000', '$3,000+', 'Not sure yet']

export const advancedFeatureOptions = [
  'Installable app experience',
  'Booking or reservations',
  'Ordering or payments',
  'CMS / editable content',
  'Search or filtering',
]
