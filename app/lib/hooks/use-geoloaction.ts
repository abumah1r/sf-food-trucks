import { useState, useEffect } from 'react'
import type {
  UserLocation,
  MapboxResponse,
  UseGeolocationReturn
} from '@/lib/types'

const token = import.meta.env.VITE_MAPBOX_TOKEN

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getLocation = async () => {
    setLoading(true)
    setError(null)

    try {
      const {
        coords: { latitude, longitude }
      } = await getCurrentPosition()

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
      )
      const data: MapboxResponse = await response.json()

      const place = data.features?.find(f => f.place_type?.includes('place'))
      const city = place?.text || 'Unknown'
      const fullAddress = data.features?.[0]?.place_name || 'Unknown'

      setLocation({
        lat: latitude,
        lng: longitude,
        city,
        fullAddress
      })
    } catch (err) {
      console.error(err)
      setError('Failed to get location')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLocation()
  }, [])

  return { location, loading, error, getLocation }
}
