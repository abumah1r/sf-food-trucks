import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGeolocation } from '@/lib/hooks'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('useGeolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()

    Object.defineProperty(global, 'navigator', {
      value: {
        geolocation: mockGeolocation
      },
      writable: true
    })

    vi.stubEnv('VITE_MAPBOX_TOKEN', 'test-token')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('gets location automatically on mount', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194
      }
    }

    const mockMapboxResponse = {
      features: [
        {
          place_name: 'San Francisco, CA, USA',
          place_type: ['place'],
          text: 'San Francisco'
        }
      ]
    }

    mockGeolocation.getCurrentPosition.mockImplementation(success => {
      success(mockPosition)
    })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMapboxResponse
    })

    const { result } = renderHook(() => useGeolocation())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.location).toEqual({
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
      fullAddress: 'San Francisco, CA, USA'
    })
    expect(result.current.error).toBeNull()
  })

  it('handles geolocation errors', async () => {
    const mockError = new Error('User denied geolocation')

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to get location')
    expect(result.current.location).toBeNull()
  })
})
