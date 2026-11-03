import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getProjectMeta } from './projectMeta.ts'

test('shows only the platform when the project has no status', () => {
  assert.equal(getProjectMeta({ platform: 'App móvil', status: null }), 'App móvil')
})

test('joins the platform and the status', () => {
  assert.equal(
    getProjectMeta({ platform: 'App móvil', status: 'En fase beta' }),
    'App móvil. En fase beta',
  )
})
