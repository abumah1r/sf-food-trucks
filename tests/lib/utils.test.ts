import { describe, it, expect } from 'vitest'
import { cn, calculateDistance, getValidCoordinate } from '@/lib/utils'

describe('cn utility', () => {
  it('combines class names correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base-class', { active: true, inactive: false })).toBe(
      'base-class active'
    )
  })

  it('handles arrays', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
  })
})

/**
 * Distance calculation tests
 * @note Written with GitHub Copilot assistance
 */
describe('calculateDistance', () => {
  it('calculates distance between San Francisco locations correctly', () => {
    // Distance between SF City Hall and Golden Gate Bridge (approximately 4.5 miles)
    const distance = calculateDistance(37.7794, -122.4193, 37.8199, -122.4783)
    expect(distance).toBeCloseTo(4.5, 0) // Within 0.5 miles
  })

  it('returns 0 for identical coordinates', () => {
    const distance = calculateDistance(37.7749, -122.4194, 37.7749, -122.4194)
    expect(distance).toBe(0)
  })

  it('handles negative coordinates', () => {
    const distance = calculateDistance(-37.7749, 122.4194, -37.7849, 122.4094)
    expect(distance).toBeGreaterThan(0)
  })
})

/**
 * Coordinate validation tests
 * @note Written with GitHub Copilot assistance
 */
describe('getValidCoordinate', () => {
  it('parses valid coordinate strings', () => {
    expect(getValidCoordinate('37.7749')).toBe(37.7749)
    expect(getValidCoordinate('-122.4194')).toBe(-122.4194)
    expect(getValidCoordinate('0')).toBe(0)
  })

  it('returns null for invalid inputs', () => {
    expect(getValidCoordinate('')).toBeNull()
    expect(getValidCoordinate('   ')).toBeNull()
    expect(getValidCoordinate('invalid')).toBeNull()
    expect(getValidCoordinate(undefined)).toBeNull()
    expect(getValidCoordinate('NaN')).toBeNull()
  })

  it('handles edge cases', () => {
    expect(getValidCoordinate('0.0')).toBe(0)
    expect(getValidCoordinate('  37.7749  ')).toBe(37.7749)
  })
})
