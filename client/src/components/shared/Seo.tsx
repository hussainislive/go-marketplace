import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'GO Marketplace'
const SITE_URL = 'https://go-marketplace-rouge.vercel.app'
const DEFAULT_DESCRIPTION =
  'GO Marketplace — Buy. Sell. Connect. Your local classifieds marketplace for cars, property, mobiles, electronics, jobs, furniture and more. Post free ads and chat with buyers and sellers near you.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

interface SeoProps {
  title?: string
  description?: string
  /** Path beginning with "/" — used for the canonical URL. */
  path?: string
  image?: string
  /** Set true on pages that shouldn't be indexed (dashboard, admin, etc.). */
  noIndex?: boolean
  /** Optional JSON-LD structured data object. */
  jsonLd?: Record<string, unknown>
}

// Per-page <head> tags: title, description, canonical, Open Graph, Twitter card,
// robots, and optional JSON-LD structured data for rich Google results.
export function Seo({ title, description, path, image, noIndex, jsonLd }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Buy. Sell. Connect.`
  const desc = description ?? DEFAULT_DESCRIPTION
  const url = `${SITE_URL}${path ?? ''}`
  const img = image ?? DEFAULT_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
