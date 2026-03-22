import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getVersionInfo, VersionInfo, GitVersionOptions } from '../index'

// Mock child_process
vi.mock('node:child_process', () => ({
  execSync: vi.fn()
}))

// Mock fs
vi.mock('node:fs', () => ({
  accessSync: vi.fn()
}))

describe('getVersionInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should throw error when version info is not initialized', () => {
    expect(() => getVersionInfo()).toThrow('Version info not initialized')
  })

  it('should throw error with custom sourceDir when not initialized', () => {
    expect(() => getVersionInfo('/custom/path')).toThrow(
      'Version info not initialized for directory: /custom/path'
    )
  })
})

describe('CacheEntry interface', () => {
  it('should have correct structure', () => {
    const cacheEntry = {
      versionInfo: {
        version: '1.0.0',
        fullVersion: '1.0.0',
        major: 1,
        minor: 0,
        patch: 0
      },
      headHash: 'abc123',
      commitHashLength: 7,
      isDirty: false
    }

    expect(cacheEntry).toHaveProperty('versionInfo')
    expect(cacheEntry).toHaveProperty('headHash')
    expect(cacheEntry).toHaveProperty('commitHashLength')
    expect(cacheEntry).toHaveProperty('isDirty')
  })
})

describe('GitVersionOptions', () => {
  it('should accept all optional properties', () => {
    const options: GitVersionOptions = {
      defaultVersion: '1.0.0',
      sourceDir: '/test',
      failOnMismatch: true,
      commitHashLength: 7,
      onFallback: (reason, error) => {
        console.log(reason, error)
      }
    }

    expect(options.defaultVersion).toBe('1.0.0')
    expect(options.sourceDir).toBe('/test')
    expect(options.failOnMismatch).toBe(true)
    expect(options.commitHashLength).toBe(7)
    expect(typeof options.onFallback).toBe('function')
  })

  it('should work with empty options', () => {
    const options: GitVersionOptions = {}
    expect(options).toEqual({})
  })
})

describe('VersionInfo interface', () => {
  it('should have required properties', () => {
    const versionInfo: VersionInfo = {
      version: '1.2.3',
      fullVersion: '1.2.3-dev.5+abc1234',
      major: 1,
      minor: 2,
      patch: 3,
      commitCount: 5,
      commitHash: 'abc1234'
    }

    expect(versionInfo.version).toBe('1.2.3')
    expect(versionInfo.fullVersion).toBe('1.2.3-dev.5+abc1234')
    expect(versionInfo.major).toBe(1)
    expect(versionInfo.minor).toBe(2)
    expect(versionInfo.patch).toBe(3)
    expect(versionInfo.commitCount).toBe(5)
    expect(versionInfo.commitHash).toBe('abc1234')
  })

  it('should work without optional properties', () => {
    const versionInfo: VersionInfo = {
      version: '1.0.0',
      fullVersion: '1.0.0',
      major: 1,
      minor: 0,
      patch: 0
    }

    expect(versionInfo.commitCount).toBeUndefined()
    expect(versionInfo.commitHash).toBeUndefined()
  })
})
