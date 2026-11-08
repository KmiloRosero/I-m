import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isSoftwareRenderer } from './webglSupport.ts'

test('recognises CPU rasterizers', () => {
  for (const name of [
    'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)',
    'llvmpipe (LLVM 15.0.7, 256 bits)',
    'Microsoft Basic Render Driver',
    'Google SwiftShader',
  ]) {
    assert.equal(isSoftwareRenderer(name), true, name)
  }
})

test('accepts real GPUs', () => {
  for (const name of [
    'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    'Apple GPU',
    'Adreno (TM) 650',
    'Mali-G78 MC14',
    'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0, D3D11)',
  ]) {
    assert.equal(isSoftwareRenderer(name), false, name)
  }
})
