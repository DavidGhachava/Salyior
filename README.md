# SALYIOR

Official SALYIOR studio website. Built with React, TypeScript, Vite and Framer Motion, with custom CSS and a native Netlify contact function.

## Local development

```bash
npm install
npm run dev
```

For local testing with the `/api/contact` Netlify function and redirects enabled, run:

```bash
npx netlify-cli@latest dev
```

Run all production checks:

```bash
npm run check
```

## Project content

- Brand and site content: `src/data/site.ts`
- Homepage sections: `src/components/HomeSections.tsx`
- Project presentation visuals: `src/components/ProjectVisual.tsx`
- Application form: `src/components/ProjectApplication.tsx`
- Global design system: `src/index.css`

Featured work uses optimized screenshots and verified live-site information for ARQI Georgia, Arrive and Kristina Languages. Keep project labels, URLs and result language accurate as the portfolio evolves.

## Contact delivery

The application posts JSON to `/api/contact`. The Netlify function validates required fields, checks a honeypot and minimum completion time, applies platform-level IP rate limiting, and sends the inquiry through Resend.

Copy `.env.example` into the deployment provider's environment settings and configure:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

The sending domain used by `CONTACT_FROM_EMAIL` must be verified with Resend before production delivery. `CONTACT_TO_EMAIL` is the inquiry destination and defaults to `salyiorbusiness@gmail.com`. Until delivery is configured, the form returns a transparent fallback message directing visitors to that address.

## Netlify deployment

Import the GitHub repository into Netlify. The included `netlify.toml` sets the production build command to `npm run build`, publishes `dist`, preserves route-specific SEO documents, configures the SPA fallback, deploys the contact function, and applies security and caching headers.

In **Project configuration → Environment variables**, add the three contact variables with the Functions scope (or all scopes), then trigger a new deployment. Environment variables placed in `netlify.toml` are not available to functions.

After the first production deploy:

1. Connect `salyior.com` in Netlify Domain management and update the required DNS records.
2. Verify the Resend sending domain used by `CONTACT_FROM_EMAIL`.
3. Submit one real project inquiry and confirm delivery and reply-to behavior.
4. Confirm canonical URLs, the sitemap and HTTPS redirects on the custom domain.
5. Submit `https://salyior.com/sitemap.xml` to Google Search Console.

Before public launch, replace temporary social-profile placeholders, confirm the contact email and have the legal drafts reviewed for the studio's jurisdiction.
