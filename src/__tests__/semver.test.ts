import { describe, it, expect } from 'vitest'
import { parseSemVer, compareSemVer } from '../index'

describe('parseSemVer', () => {
  it('should parse valid semver without prefix', () => {
    expect(parseSemVer('1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3
    })
  })

  it('should parse valid semver with v prefix', () => {
    expect(parseSemVer('v1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3
    })
  })

  it('should parse version with zeros', () => {
    expect(parseSemVer('0.0.0')).toEqual({
      major: 0,
      minor: 0,
      patch: 0
    })
  })

  it('should parse large version numbers', () => {
    expect(parseSemVer('999.888.777')).toEqual({
      major: 999,
      minor: 888,
      patch: 777
    })
  })

  it('should return null for invalid semver - missing patch', () => {
    expect(parseSemVer('1.2')).toBeNull()
  })

  it('should return null for invalid semver - missing minor', () => {
    expect(parseSemVer('1')).toBeNull()
  })

  it('should return null for invalid semver - non-numeric', () => {
    expect(parseSemVer('a.b.c')).toBeNull()
  })

  it('should return null for invalid semver - empty string', () => {
    expect(parseSemVer('')).toBeNull()
  })

  it('should return null for invalid semver - pre-release suffix', () => {
    expect(parseSemVer('1.2.3-alpha')).toBeNull()
  })

  it('should return null for invalid semver - build metadata', () => {
    expect(parseSemVer('1.2.3+build')).toBeNull()
  })
})

describe('compareSemVer', () => {
  it('should return negative when v1 < v2 (major)', () => {
    expect(compareSemVer('1.0.0', '2.0.0')).toBeLessThan(0)
  })

  it('should return positive when v1 > v2 (major)', () => {
    expect(compareSemVer('2.0.0', '1.0.0')).toBeGreaterThan(0)
  })

  it('should return negative when v1 < v2 (minor)', () => {
    expect(compareSemVer('1.0.0', '1.1.0')).toBeLessThan(0)
  })

  it('should return positive when v1 > v2 (minor)', () => {
    expect(compareSemVer('1.1.0', '1.0.0')).toBeGreaterThan(0)
  })

  it('should return negative when v1 < v2 (patch)', () => {
    expect(compareSemVer('1.0.0', '1.0.1')).toBeLessThan(0)
  })

  it('should return positive when v1 > v2 (patch)', () => {
    expect(compareSemVer('1.0.1', '1.0.0')).toBeGreaterThan(0)
  })

  it('should return 0 when versions are equal', () => {
    expect(compareSemVer('1.2.3', '1.2.3')).toBe(0)
  })

  it('should return 0 when versions are equal with v prefix', () => {
    expect(compareSemVer('v1.2.3', '1.2.3')).toBe(0)
  })

  it('should throw error for invalid v1', () => {
    expect(() => compareSemVer('invalid', '1.0.0')).toThrow('Invalid semver format')
  })

  it('should throw error for invalid v2', () => {
    expect(() => compareSemVer('1.0.0', 'invalid')).toThrow('Invalid semver format')
  })

  it('should throw error for both invalid versions', () => {
    expect(() => compareSemVer('invalid1', 'invalid2')).toThrow('Invalid semver format')
  })
})
