import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PersonalInfo } from '../types/personalInfo.ts'
import type { Project } from '../types/project.ts'
import { homeJsonLd, projectJsonLd, serializeJsonLd, type JsonLd } from './structuredData.ts'

const site = new URL('https://example.dev')

const personalInfo: PersonalInfo = {
  name: 'Kmilo Rosero',
  alternateName: 'Camilo Rosero',
  firstName: 'Kmilo',
  lastName: 'Rosero',
  seoTitle: 'Kmilo Rosero · Software developer',
  photoSrc: '/images/profile/photo.webp',
  address: { locality: 'Pasto', region: 'Nariño', country: 'CO' },
  degree: 'Software Engineering',
  technicalDegree: 'Technical diploma',
  title: 'Software Engineer',
  heroRoles: [],
  studies: 'Software Engineering student',
  position: 'Freelance developer',
  availability: 'Available',
  whatsappUrl: null,
  semester: 'Fifth semester',
  university: 'Universidad Cooperativa de Colombia',
  location: 'Pasto, Nariño, Colombia',
  email: 'hello@example.dev',
  metaDescription: 'Portfolio.',
  about: '',
  personality: '',
  workStyle: '',
  interests: [],
  ambition: '',
  featuredStack: ['TypeScript'],
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/example' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/example' },
  ],
  cvUrl: null,
}

const project: Project = {
  slug: 'demo',
  name: 'Demo </script><script>alert(1)</script>',
  platform: 'Web',
  layout: 'wide',
  block: 'stone',
  categories: ['personal'],
  description: 'Una demo.',
  problem: null,
  purpose: null,
  solution: null,
  technologies: ['TypeScript'],
  frameworks: ['React', 'Vite'],
  contribution: null,
  collaboration: null,
  location: null,
  period: null,
  status: null,
  verifiedFeatures: [],
  architecture: [],
  flowSteps: [],
  screenshots: [],
  repoUrl: 'https://github.com/demo/demo',
  repoLabel: 'Código',
  extraRepoUrl: null,
  demoUrl: null,
  demoLabel: 'Demo',
  hasCaseStudy: true,
}

const graph = (data: JsonLd) => data['@graph'] as JsonLd[]

test('escapes < so a value can never close the script tag', () => {
  const json = serializeJsonLd({ name: project.name })
  assert.ok(!json.includes('</script'))
  assert.deepEqual(JSON.parse(json), { name: project.name })
})

test('describes the person with both names, an absolute photo and the profiles', () => {
  const [person, website] = graph(homeJsonLd(personalInfo, site, 'es'))
  assert.equal(person?.['name'], personalInfo.name)
  assert.equal(person?.['alternateName'], personalInfo.alternateName)
  assert.equal(person?.['image'], new URL(personalInfo.photoSrc, site).href)
  assert.deepEqual(
    person?.['sameAs'],
    personalInfo.socialLinks.map(({ url }) => url),
  )
  assert.deepEqual(website?.['author'], { '@id': 'https://example.dev/#person' })
  assert.equal(website?.['inLanguage'], 'es')
})

test('credits a project to the person and numbers its breadcrumbs', () => {
  const crumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Proyectos', path: '/#proyectos' },
    { name: 'Demo', path: '/proyectos/demo' },
  ]
  const [code, breadcrumbs] = graph(projectJsonLd(project, site, '/proyectos/demo', crumbs))
  assert.equal(code?.['url'], 'https://example.dev/proyectos/demo')
  assert.equal(code?.['codeRepository'], project.repoUrl)
  assert.equal(code?.['keywords'], 'React, Vite, TypeScript')
  assert.equal(code?.['image'], undefined)
  assert.deepEqual(code?.['author'], { '@id': 'https://example.dev/#person' })
  const items = breadcrumbs?.['itemListElement'] as JsonLd[]
  assert.deepEqual(
    items.map((item) => item['position']),
    [1, 2, 3],
  )
  assert.equal(items[2]?.['item'], 'https://example.dev/proyectos/demo')
})
