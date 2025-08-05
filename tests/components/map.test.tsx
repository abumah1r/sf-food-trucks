import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mapboxgl from 'mapbox-gl'

import { MapComponent } from '@/components'
import type { UserLocation, FoodTruckWithDistance } from '@/lib/types'
import { mockMap, mockMarker, mockPopup, mockLngLatBounds } from '../setup'

const mockedMapboxgl = vi.mocked(mapboxgl)

describe('MapComponent', () => {
  const mockUserLocation: UserLocation = {
    lat: 37.7749,
    lng: -122.4194,
    city: 'San Francisco',
    fullAddress: 'San Francisco, CA, USA'
  }

  const mockFoodTrucks: FoodTruckWithDistance[] = [
    {
      objectid: '1',
      applicant: 'Test Truck 1',
      facilitytype: 'Truck',
      status: 'APPROVED',
      latitude: '37.7749',
      longitude: '-122.4194',
      address: '123 Test St',
      fooditems: 'Tacos, Burritos',
      distance: 0.5,
      truckLat: 37.7749,
      truckLng: -122.4194
    },
    {
      objectid: '2',
      applicant: 'Test Truck 2',
      facilitytype: 'Truck',
      status: 'APPROVED',
      address: '456 Test Ave',
      fooditems: 'Pizza, Sandwiches',
      distance: 1.2,
      truckLat: 37.7849,
      truckLng: -122.4094
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_MAPBOX_TOKEN', 'test-mapbox-token')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('Map initialization', () => {
    it('initializes map with correct config', () => {
      render(<MapComponent userLocation={null} foodTrucks={[]} />)

      expect(mockedMapboxgl.Map).toHaveBeenCalledWith({
        container: expect.any(Object),
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.4194, 37.7749],
        zoom: 11,
        attributionControl: false
      })
    })

    it('sets mapbox access token', () => {
      render(<MapComponent userLocation={null} foodTrucks={[]} />)

      expect(mapboxgl.accessToken).toBe('test-mapbox-token')
    })
  })

  describe('User location marker', () => {
    it('creates user marker when location provided', () => {
      render(<MapComponent userLocation={mockUserLocation} foodTrucks={[]} />)

      expect(mockedMapboxgl.Marker).toHaveBeenCalledWith({
        color: 'blue',
        scale: 0.7
      })
      expect(mockMarker.setLngLat).toHaveBeenCalledWith([-122.4194, 37.7749])
      expect(mockMarker.addTo).toHaveBeenCalled()
    })

    it('creates user location popup', () => {
      render(<MapComponent userLocation={mockUserLocation} foodTrucks={[]} />)

      expect(mockedMapboxgl.Popup).toHaveBeenCalled()
      expect(mockPopup.setHTML).toHaveBeenCalledWith(
        '<div><strong>Your Location</strong></div>'
      )
      expect(mockMarker.setPopup).toHaveBeenCalledWith(mockPopup)
    })

    it('does not create extra markers when no location', () => {
      render(<MapComponent userLocation={null} foodTrucks={[]} />)

      expect(mockedMapboxgl.Map).toHaveBeenCalled()
      expect(mockedMapboxgl.Marker).not.toHaveBeenCalled()
    })
  })

  describe('Food truck markers', () => {
    it('creates markers for all food trucks', () => {
      render(<MapComponent userLocation={null} foodTrucks={mockFoodTrucks} />)

      // no user marker since user location is null
      expect(mockedMapboxgl.Marker).toHaveBeenCalledTimes(2)

      // default color and scale set in map component
      expect(mockedMapboxgl.Marker).toHaveBeenCalledWith({
        color: '#ef4444',
        scale: 1.3
      })
    })

    it('creates markers for user and food trucks', () => {
      render(
        <MapComponent
          userLocation={mockUserLocation}
          foodTrucks={mockFoodTrucks}
        />
      )

      expect(mockedMapboxgl.Marker).toHaveBeenCalledTimes(3)
    })

    it('creates popups with correct food truck information', () => {
      render(
        <MapComponent
          userLocation={mockUserLocation}
          foodTrucks={mockFoodTrucks}
        />
      )

      const popupCalls = mockPopup.setHTML.mock.calls
      expect(popupCalls.length).toBeGreaterThan(1)

      const allPopupHTML = popupCalls.map(call => call[0]).join(' ')
      expect(allPopupHTML).toContain('Test Truck 1')
    })
  })

  describe('Map bounds and zoom', () => {
    it('fits bounds to show all food trucks', () => {
      render(
        <MapComponent
          userLocation={mockUserLocation}
          foodTrucks={mockFoodTrucks}
        />
      )

      expect(mockLngLatBounds.extend).toHaveBeenCalledTimes(2)

      // default bounds set in map component
      expect(mockMap.fitBounds).toHaveBeenCalledWith(mockLngLatBounds, {
        padding: 60,
        maxZoom: 14,
        duration: 1000
      })
    })

    it('does not fit bounds when no food trucks', () => {
      render(<MapComponent userLocation={mockUserLocation} foodTrucks={[]} />)

      expect(mockMap.fitBounds).not.toHaveBeenCalled()
    })
  })

  describe('Cleanup', () => {
    it('removes map on unmount', () => {
      const { unmount } = render(
        <MapComponent
          userLocation={mockUserLocation}
          foodTrucks={mockFoodTrucks}
        />
      )

      unmount()

      expect(mockMap.remove).toHaveBeenCalled()
    })
  })

  describe('Error handling', () => {
    it('handles missing map container gracefully', () => {
      expect(() => {
        render(
          <MapComponent
            userLocation={mockUserLocation}
            foodTrucks={mockFoodTrucks}
          />
        )
      }).not.toThrow()
    })

    it('handles malformed coordinates gracefully', () => {
      const malformedTrucks: FoodTruckWithDistance[] = [
        {
          ...mockFoodTrucks[0],
          truckLat: NaN,
          truckLng: NaN
        }
      ]

      expect(() => {
        render(
          <MapComponent
            userLocation={mockUserLocation}
            foodTrucks={malformedTrucks}
          />
        )
      }).not.toThrow()
    })
  })
})
