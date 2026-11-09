import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseFirstRepoYear, parsePublicRepos } from './githubStats.ts'

test('reads the public repository count', () => {
  assert.equal(parsePublicRepos({ login: 'KmiloRosero', public_repos: 36 }), 36)
  assert.equal(parsePublicRepos({ public_repos: 0 }), 0)
})

test('rejects responses that are not a profile', () => {
  assert.equal(parsePublicRepos({ message: 'API rate limit exceeded' }), null)
  assert.equal(parsePublicRepos({ public_repos: '36' }), null)
  assert.equal(parsePublicRepos({ public_repos: -1 }), null)
  assert.equal(parsePublicRepos(null), null)
})

test('reads the year of the oldest repository', () => {
  assert.equal(parseFirstRepoYear([{ name: 'Banco', created_at: '2024-09-12T12:31:05Z' }]), 2024)
})

test('ignores an empty or unexpected repository list', () => {
  assert.equal(parseFirstRepoYear([]), null)
  assert.equal(parseFirstRepoYear([{ name: 'Banco' }]), null)
  assert.equal(parseFirstRepoYear({ message: 'Not Found' }), null)
})
