import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useFoodTrucks } from '@/lib/hooks'
import type { FoodTruck } from '@/lib/types'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useFoodTrucks', () => {
  const mockFoodTrucks: FoodTruck[] = [
    {
      objectid: '1',
      applicant: 'Test Truck 1',
      facilitytype: 'Truck',
      status: 'APPROVED',
      latitude: '37.7749',
      longitude: '-122.4194',
      address: '123 Test St',
      fooditems: 'Tacos, Burritos'
    },
    {
      objectid: '2',
      applicant: 'Test Truck 2',
      facilitytype: 'Truck',
      status: 'APPROVED',
      latitude: '37.7849',
      longitude: '-122.4094',
      address: '456 Test Ave',
      fooditems: 'Pizza, Sandwiches'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches food trucks on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodTrucks
    })

    const { result } = renderHook(() => useFoodTrucks(null))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.foodTrucks).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('handles fetch errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useFoodTrucks(null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.foodTrucks).toHaveLength(0)
  })

  it('calculates closest trucks when user location is provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFoodTrucks
    })

    const userLocation = { lat: 37.7749, lng: -122.4194 }
    const { result } = renderHook(() => useFoodTrucks(userLocation))

    await waitFor(() => {
      expect(result.current.closestTrucks).toHaveLength(2)
    })

    expect(result.current.closestTrucks[0].distance).toBeLessThan(
      result.current.closestTrucks[1].distance
    )
  })

  it('filters out trucks without valid coordinates', async () => {
    const trucksWithInvalidCoords = [
      ...mockFoodTrucks,
      {
        objectid: '3',
        applicant: 'Invalid Truck',
        facilitytype: 'Truck',
        status: 'APPROVED',
        latitude: '',
        longitude: '',
        address: '789 Invalid St'
      }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => trucksWithInvalidCoords
    })

    const userLocation = { lat: 37.7749, lng: -122.4194 }
    const { result } = renderHook(() => useFoodTrucks(userLocation))

    await waitFor(() => {
      expect(result.current.closestTrucks).toHaveLength(2)
    })

    expect(
      result.current.closestTrucks.every(
        truck => truck.applicant !== 'Invalid Truck'
      )
    ).toBe(true)
  })
})
