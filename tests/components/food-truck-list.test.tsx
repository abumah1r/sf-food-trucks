import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { FoodTruckList } from '@/components'
import type { FoodTruckWithDistance } from '@/lib/types'

describe('FoodTruckList', () => {
  const mockTrucks: FoodTruckWithDistance[] = [
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
      latitude: '37.7849',
      longitude: '-122.4094',
      address: '456 Test Ave',
      fooditems: 'Pizza, Sandwiches',
      distance: 1.2,
      truckLat: 37.7849,
      truckLng: -122.4094
    }
  ]

  describe('Page header', () => {
    it('displays correct header with truck count', () => {
      render(<FoodTruckList trucks={mockTrucks} loading={false} error={null} />)

      expect(screen.getByText('Closest Food Trucks (2/5)')).toBeInTheDocument()
    })

    it('updates count when truck array changes', () => {
      const { rerender } = render(
        <FoodTruckList trucks={mockTrucks} loading={false} error={null} />
      )

      expect(screen.getByText('Closest Food Trucks (2/5)')).toBeInTheDocument()

      rerender(
        <FoodTruckList trucks={[mockTrucks[0]]} loading={false} error={null} />
      )

      expect(screen.getByText('Closest Food Trucks (1/5)')).toBeInTheDocument()
    })
  })

  describe('Truck cards display', () => {
    it('displays all food trucks correctly', () => {
      render(<FoodTruckList trucks={mockTrucks} loading={false} error={null} />)

      expect(screen.getByText('Test Truck 1')).toBeInTheDocument()
      expect(screen.getByText('Test Truck 2')).toBeInTheDocument()
      expect(screen.getByText('0.5 mi')).toBeInTheDocument()
      expect(screen.getByText('1.2 mi')).toBeInTheDocument()
      expect(screen.getByText('Tacos, Burritos')).toBeInTheDocument()
      expect(screen.getByText('Pizza, Sandwiches')).toBeInTheDocument()
      expect(screen.getByText('📍 123 Test St')).toBeInTheDocument()
      expect(screen.getByText('📍 456 Test Ave')).toBeInTheDocument()
    })

    it('displays distance with correct precision', () => {
      const trucksWithPreciseDistance: FoodTruckWithDistance[] = [
        {
          ...mockTrucks[0],
          distance: 1.23456
        }
      ]

      render(
        <FoodTruckList
          trucks={trucksWithPreciseDistance}
          loading={false}
          error={null}
        />
      )

      expect(screen.getByText('1.2 mi')).toBeInTheDocument()
    })
  })

  describe('Loading state', () => {
    it('shows loading message when no trucks and loading', () => {
      render(<FoodTruckList trucks={[]} loading={true} error={null} />)

      expect(screen.getByText('Loading food trucks...')).toBeInTheDocument()
    })

    it('does not show loading message when trucks exist', () => {
      render(<FoodTruckList trucks={mockTrucks} loading={true} error={null} />)

      expect(
        screen.queryByText('Loading food trucks...')
      ).not.toBeInTheDocument()
      expect(screen.getByText('Test Truck 1')).toBeInTheDocument()
    })
  })

  describe('Error state', () => {
    it('shows error message', () => {
      render(
        <FoodTruckList
          trucks={[]}
          loading={false}
          error='Failed to fetch food trucks'
        />
      )

      expect(
        screen.getByText('Failed to fetch food trucks')
      ).toBeInTheDocument()
    })

    it('shows custom error messages', () => {
      const customError = 'Network timeout occurred'

      render(<FoodTruckList trucks={[]} loading={false} error={customError} />)

      expect(screen.getByText(customError)).toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('shows empty message when no trucks and not loading', () => {
      render(<FoodTruckList trucks={[]} loading={false} error={null} />)

      expect(
        screen.getByText('No food trucks found nearby')
      ).toBeInTheDocument()
    })

    it('does not show empty message when loading', () => {
      render(<FoodTruckList trucks={[]} loading={true} error={null} />)

      expect(
        screen.queryByText('No food trucks found nearby')
      ).not.toBeInTheDocument()
    })

    it('does not show empty message when error exists', () => {
      render(<FoodTruckList trucks={[]} loading={false} error='Some error' />)

      expect(
        screen.queryByText('No food trucks found nearby')
      ).not.toBeInTheDocument()
    })
  })
})
