import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts degrees to radians.
 *
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 *
 * @note Formulated with GitHub Copilot assistance
 */
const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/**
 * Calculates the great circle distance between two points on Earth using the Haversine formula.
 * Returns distance in miles.
 *
 * @param lat1 - Latitude of first point in decimal degrees
 * @param lng1 - Longitude of first point in decimal degrees
 * @param lat2 - Latitude of second point in decimal degrees
 * @param lng2 - Longitude of second point in decimal degrees
 * @returns Distance between points in miles
 *
 * @example
 * calculateDistance(37.7749, -122.4194, 37.7849, -122.4094) // ~0.87 miles
 *
 * @note Formulated with GitHub Copilot assistance
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 3959
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const lat1Rad = toRadians(lat1)
  const lat2Rad = toRadians(lat2)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Validates and parses a coordinate string value into a number.
 * Returns null for invalid, empty, or non-numeric values.
 *
 * @param value - String representation of a coordinate (latitude or longitude)
 * @returns Parsed coordinate as number, or null if invalid
 *
 * @example
 * getValidCoordinate("37.7749") // 37.7749
 * getValidCoordinate("") // null
 * getValidCoordinate("invalid") // null
 * getValidCoordinate(undefined) // null
 *
 * @note Formulated with GitHub Copilot assistance
 */
export const getValidCoordinate = (
  value: string | undefined
): number | null => {
  if (!value?.trim()) return null
  const parsed = parseFloat(value)
  return isNaN(parsed) ? null : parsed
}
