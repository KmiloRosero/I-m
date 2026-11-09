import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pathLocale, projectPath, sectionHref, translateHash, translatePath } from './paths.ts'

test('tells the language from the path', () => {
  assert.equal(pathLocale('/'), 'es')
  assert.equal(pathLocale('/proyectos/cinetracker'), 'es')
  assert.equal(pathLocale('/en'), 'en')
  assert.equal(pathLocale('/en/projects/cinetracker'), 'en')
  assert.equal(pathLocale('/entrevista'), 'es')
})

test('links sections and projects in each language', () => {
  assert.equal(sectionHref('about', 'es'), '/#sobre-mi')
  assert.equal(sectionHref('about', 'en'), '/en#about')
  assert.equal(projectPath('mercajusto', 'es'), '/proyectos/mercajusto')
  assert.equal(projectPath('mercajusto', 'en'), '/en/projects/mercajusto')
})

test('finds the same page in the other language', () => {
  assert.equal(translatePath('/', 'en'), '/en')
  assert.equal(translatePath('/en', 'es'), '/')
  assert.equal(translatePath('/en/', 'es'), '/')
  assert.equal(translatePath('/proyectos/reticula', 'en'), '/en/projects/reticula')
  assert.equal(translatePath('/en/projects/reticula', 'es'), '/proyectos/reticula')
  assert.equal(translatePath('/blog', 'en'), '/en/blog')
  assert.equal(translatePath('/en/blog/portatil-3d', 'es'), '/blog/portatil-3d')
  assert.equal(translatePath('/algo-que-no-existe', 'en'), '/en')
})

test('keeps the reader on the same section when switching language', () => {
  assert.equal(translateHash('#sobre-mi', 'es', 'en'), '#about')
  assert.equal(translateHash('#contact', 'en', 'es'), '#contacto')
  assert.equal(translateHash('#xp-card-1', 'es', 'en'), '')
  assert.equal(translateHash('', 'es', 'en'), '')
})
