import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.stubEnv('VITE_MAPBOX_TOKEN', 'test-mapbox-token')

const mockMap = {
  remove: vi.fn(),
  fitBounds: vi.fn()
}

const mockMarker = {
  setLngLat: vi.fn().mockReturnThis(),
  setPopup: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn()
}

const mockPopup = {
  setHTML: vi.fn().mockReturnThis()
}

const mockLngLatBounds = {
  extend: vi.fn()
}

vi.mock('mapbox-gl', () => {
  const MockedMap = vi.fn(() => mockMap)
  const MockedMarker = vi.fn(() => mockMarker)
  const MockedPopup = vi.fn(() => mockPopup)
  const MockedLngLatBounds = vi.fn(() => mockLngLatBounds)

  return {
    default: {
      Map: MockedMap,
      Marker: MockedMarker,
      Popup: MockedPopup,
      LngLatBounds: MockedLngLatBounds,
      accessToken: ''
    }
  }
})

export { mockMap, mockMarker, mockPopup, mockLngLatBounds }
