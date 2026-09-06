import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { LocalizedSite } = await server.ssrLoadModule('/src/App.tsx')
  const { projects, navItems } = await server.ssrLoadModule('/src/siteData.ts')
  const cases = [
    ['/en', 'Built to impress.'], ['/en/work', 'Work with character.'],
    ['/en/solutions', 'More than a website.'], ['/en/process', 'No guesswork.'],
    ['/en/pricing', 'The right website.'], ['/en/about', 'Small by choice.'],
    ['/en/contact', 'Tell us what’s next.'], ['/en/contact?intent=call', 'Let’s find a time.'],
    ['/en/contact?intent=review', 'A fresh pair of eyes.'], ['/en/privacy', 'Your details, treated with care.'],
    ['/en/not-a-page', 'Let’s get you back.'],
    ...projects.map(project => [`/en/work/${project.slug}`, project.name]),
  ]
  for (const [route, heading] of cases) {
    const html = renderToString(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(LocalizedSite)))
    assert.ok(html.includes(heading), `Wrong content at ${route}`)
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one main heading at ${route}`)
    assert.ok(!/[✳❄❅❆]/u.test(html), `Unwanted snowflake mark at ${route}`)
    for (const item of navItems) assert.ok(html.includes(`href="/en/${item.toLowerCase()}"`), `Missing ${item} navigation`)
    if (route === '/en/work') for (const project of projects) assert.ok(html.includes(`href="/en/work/${project.slug}"`))
    if (route === '/en/contact?intent=call') assert.ok(html.includes('contact-time'), 'Call request time missing')
    if (route === '/en') assert.equal((html.match(/class="project-card"/g) || []).length, 3, 'Home should only show selected work')
  }
  for (const project of projects) {
    if (project.image.startsWith('/')) assert.ok(fs.existsSync(`public${project.image}`), `Missing image ${project.image}`)
    else {
      const response = await fetch(project.image, { method: 'HEAD' })
      assert.ok(response.ok && response.headers.get('content-type')?.startsWith('image/'), `Unavailable image ${project.image}`)
    }
  }
  console.log(`Passed: ${cases.length} page renders, navigation, gallery coverage, contact variants and all project images.`)
} finally { await server.close() }
