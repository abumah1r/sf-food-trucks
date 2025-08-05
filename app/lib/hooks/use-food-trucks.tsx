import { useState, useEffect, useMemo } from 'react'
import type {
  FoodTruck,
  FoodTruckWithDistance,
  UserLocation
} from '@/lib/types'
import { calculateDistance, getValidCoordinate } from '@/lib/utils'

const getCoordinates = (truck: FoodTruck) => {
  const lat = truck.latitude
    ? getValidCoordinate(truck.latitude)
    : getValidCoordinate(truck.location?.latitude)
  const lng = truck.longitude
    ? getValidCoordinate(truck.longitude)
    : getValidCoordinate(truck.location?.longitude)
  return lat && lng ? { lat, lng } : null
}

const removeDuplicates = (trucks: FoodTruckWithDistance[]) => {
  const seenObjectIds = new Set<string>()
  const seenLocations = new Set<string>()

  return trucks.filter(truck => {
    const objectId = truck.objectid
    const locationKey = `${truck.truckLat.toFixed(6)},${truck.truckLng.toFixed(6)}`

    if (seenObjectIds.has(objectId) || seenLocations.has(locationKey)) {
      return false
    }

    seenObjectIds.add(objectId)
    seenLocations.add(locationKey)
    return true
  })
}

export const useFoodTrucks = (userLocation: UserLocation | null) => {
  const [foodTrucks, setFoodTrucks] = useState<FoodTruck[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFoodTrucks = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          'https://data.sfgov.org/resource/rqzj-sfat.json'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch food trucks')
        }

        const data: FoodTruck[] = await response.json()

        const activeTrucks = data.filter(
          truck =>
            truck.status === 'APPROVED' &&
            truck.facilitytype === 'Truck' &&
            (truck.latitude || truck.location?.latitude) &&
            (truck.longitude || truck.location?.longitude)
        )

        setFoodTrucks(activeTrucks)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch food trucks'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchFoodTrucks()
  }, [])

  const closestTrucks = useMemo(() => {
    if (!userLocation || !foodTrucks.length) return []

    const trucksWithDistance = foodTrucks
      .map(truck => {
        const coords = getCoordinates(truck)
        if (!coords) return null

        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          coords.lat,
          coords.lng
        )

        return {
          ...truck,
          distance,
          truckLat: coords.lat,
          truckLng: coords.lng
        }
      })
      .filter((truck): truck is FoodTruckWithDistance => truck !== null)
      .sort((a, b) => a.distance - b.distance)

    return removeDuplicates(trucksWithDistance).slice(0, 5)
  }, [userLocation, foodTrucks])

  return { foodTrucks, closestTrucks, loading, error }
}
