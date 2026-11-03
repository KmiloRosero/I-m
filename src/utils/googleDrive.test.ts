import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getDriveDownloadUrl } from './googleDrive.ts'

test('builds a download URL from a shared Drive file', () => {
  assert.equal(
    getDriveDownloadUrl('https://drive.google.com/file/d/abc_123-X/view?usp=sharing'),
    'https://drive.google.com/uc?export=download&id=abc_123-X',
  )
})

test('returns null for links that are not Drive files', () => {
  assert.equal(getDriveDownloadUrl('https://docs.google.com/document/d/abc/edit'), null)
  assert.equal(getDriveDownloadUrl('https://example.com/cv.pdf'), null)
})
