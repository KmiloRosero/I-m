/**
 * Smoke test of the production build: starts `next start`, then walks every
 * URL in the sitemap, in both languages. Run after `npm run build`.
 */
import assert from 'node:assert/strict'
import { spawn, type ChildProcess } from 'node:child_process'
import { after, before, test } from 'node:test'

const PORT = Number(process.env['SMOKE_PORT'] ?? 3999)
const BASE = `http://localhost:${PORT}`
let server: ChildProcess | undefined

before(async () => {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(PORT)], {
    stdio: 'ignore',
  })
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      if ((await fetch(BASE)).ok) return
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`next start did not answer on ${BASE}`)
})

after(() => {
  server?.kill()
})

async function get(path: string) {
  const response = await fetch(BASE + path)
  return { status: response.status, html: await response.text() }
}

/** Paths listed in the sitemap, whatever host the build used for absolute URLs. */
async function sitemapPaths(): Promise<string[]> {
  const { status, html: xml } = await get('/sitemap.xml')
  assert.equal(status, 200)
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url ?? '').pathname)
}

test('the sitemap lists every page in both languages, with hreflang', async () => {
  const { html: xml } = await get('/sitemap.xml')
  const paths = await sitemapPaths()
  assert.ok(paths.includes('/') && paths.includes('/en'), 'both home pages')
  assert.ok(paths.some((path) => path.startsWith('/proyectos/')), 'Spanish case studies')
  assert.ok(paths.some((path) => path.startsWith('/en/projects/')), 'English case studies')
  assert.ok(paths.some((path) => path.startsWith('/blog/')), 'Spanish articles')
  assert.ok(paths.some((path) => path.startsWith('/en/blog/')), 'English articles')
  assert.equal((xml.match(/hreflang="en"/g) ?? []).length, paths.length, 'every page links its English version')
})

test('every page renders in its language, with a canonical URL and valid structured data', async () => {
  for (const path of await sitemapPaths()) {
    const { status, html } = await get(path)
    assert.equal(status, 200, path)
    const lang = path === '/en' || path.startsWith('/en/') ? 'en' : 'es'
    assert.match(html, new RegExp(`<html[^>]*lang="${lang}"`), `${path} declares lang="${lang}"`)
    assert.match(html, /<link rel="canonical" href="[^"]+"/, `${path} has a canonical URL`)
    assert.match(html, /<meta property="og:image" content="[^"]+"/, `${path} has a share image`)
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
      assert.doesNotThrow(() => JSON.parse(json ?? ''), `${path} structured data parses`)
    }
  }
})

test('the home pages show their own language', async () => {
  const spanish = await get('/')
  const english = await get('/en')
  assert.ok(spanish.html.includes('Sobre mí') && spanish.html.includes('Cómo trabajo'))
  assert.ok(english.html.includes('About') && english.html.includes('How I work'))
  assert.ok(!english.html.includes('Ver proyectos'), 'no Spanish button copy on the English page')
})

test('unknown pages answer 404 in either language', async () => {
  assert.equal((await get('/esta-pagina-no-existe')).status, 404)
  assert.equal((await get('/en/this-page-does-not-exist')).status, 404)
  assert.equal((await get('/proyectos/no-existe')).status, 404)
  assert.equal((await get('/en/blog/missing')).status, 404)
})
