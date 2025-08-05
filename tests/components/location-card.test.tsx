import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { LocationCard } from '@/components'
import type { UserLocation } from '@/lib/types'

describe('LocationCard', () => {
  const mockOnGetLocation = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial state (no location)', () => {
    it('shows get location button when no location', () => {
      render(
        <LocationCard
          location={null}
          loading={false}
          error={null}
          onGetLocation={mockOnGetLocation}
        />
      )

      expect(screen.getByText('Your Location')).toBeInTheDocument()
      expect(screen.getByText('Find food trucks near you')).toBeInTheDocument()
      expect(screen.getByText('Get My Location')).toBeInTheDocument()
    })

    it('calls onGetLocation when Get My Location button is clicked', () => {
      render(
        <LocationCard
          location={null}
          loading={false}
          error={null}
          onGetLocation={mockOnGetLocation}
        />
      )

      fireEvent.click(screen.getByText('Get My Location'))
      expect(mockOnGetLocation).toHaveBeenCalledTimes(1)
    })
  })

  describe('Loading state', () => {
    it('shows loading state', () => {
      render(
        <LocationCard
          location={null}
          loading={true}
          error={null}
          onGetLocation={mockOnGetLocation}
        />
      )

      expect(screen.getByText('Finding location...')).toBeInTheDocument()
      expect(screen.queryByText('Get My Location')).not.toBeInTheDocument()
    })
  })

  describe('Success state (with location)', () => {
    const mockLocation: UserLocation = {
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
      fullAddress: 'San Francisco, CA, USA'
    }

    it('shows location when available', () => {
      render(
        <LocationCard
          location={mockLocation}
          loading={false}
          error={null}
          onGetLocation={mockOnGetLocation}
        />
      )

      expect(screen.getByText('San Francisco, CA, USA')).toBeInTheDocument()
      expect(screen.getByText('Update Location')).toBeInTheDocument()
    })

    it('shows Update Location button that calls onGetLocation', () => {
      render(
        <LocationCard
          location={mockLocation}
          loading={false}
          error={null}
          onGetLocation={mockOnGetLocation}
        />
      )

      fireEvent.click(screen.getByText('Update Location'))
      expect(mockOnGetLocation).toHaveBeenCalledTimes(1)
    })

    it('disables Update Location button when loading', () => {
      render(
        <LocationCard
          location={mockLocation}
          loading={true}
          error={null}
          onGetLocation={mockOnGetLocation}
        />
      )

      const updateButton = screen.getByText('Update Location')
      expect(updateButton).toBeDisabled()
    })
  })

  describe('Error state', () => {
    it('shows error message and try again button', () => {
      render(
        <LocationCard
          location={null}
          loading={false}
          error='Failed to get location'
          onGetLocation={mockOnGetLocation}
        />
      )

      expect(screen.getByText('Failed to get location')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('calls onGetLocation when Try Again button is clicked', () => {
      render(
        <LocationCard
          location={null}
          loading={false}
          error='Failed to get location'
          onGetLocation={mockOnGetLocation}
        />
      )

      fireEvent.click(screen.getByText('Try Again'))
      expect(mockOnGetLocation).toHaveBeenCalledTimes(1)
    })

    it('shows custom error messages', () => {
      const customError = 'Network connection failed'

      render(
        <LocationCard
          location={null}
          loading={false}
          error={customError}
          onGetLocation={mockOnGetLocation}
        />
      )

      expect(screen.getByText(customError)).toBeInTheDocument()
    })
  })
})
