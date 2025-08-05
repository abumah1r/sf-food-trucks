export interface FoodTruck {
  objectid: string
  applicant: string
  facilitytype: string
  address?: string
  status: string
  fooditems?: string
  latitude?: string
  longitude?: string
  location?: {
    latitude?: string
    longitude?: string
  }
}

export interface FoodTruckWithDistance extends FoodTruck {
  distance: number
  truckLat: number
  truckLng: number
}

export interface UserLocation {
  lat: number
  lng: number
  city?: string
  fullAddress?: string
}

export interface UseGeolocationReturn {
  location: UserLocation | null
  loading: boolean
  error: string | null
  getLocation: () => Promise<void>
}

export interface MapboxResponse {
  type: 'FeatureCollection'
  features: MapboxFeature[]
}

export interface MapboxFeature {
  place_type: string[]
  text: string
  place_name: string
}
