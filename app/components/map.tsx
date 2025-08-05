import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { FoodTruckWithDistance, UserLocation } from '../lib/types'

interface MapComponentProps {
  userLocation: UserLocation | null
  foodTrucks: FoodTruckWithDistance[]
}

const createUserMarker = (userLocation: UserLocation, map: mapboxgl.Map) => {
  return new mapboxgl.Marker({ color: 'blue', scale: 0.7 })
    .setLngLat([userLocation.lng, userLocation.lat])
    .setPopup(
      new mapboxgl.Popup().setHTML('<div><strong>Your Location</strong></div>')
    )
    .addTo(map)
}

const createTruckMarker = (truck: FoodTruckWithDistance, map: mapboxgl.Map) => {
  const popupHTML = `
    <div style="padding: 12px; max-width: 200px;">
      <h4 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${truck.applicant}</h4>
      ${truck.fooditems ? `<p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.4;">${truck.fooditems}</p>` : ''}
      ${truck.address ? `<p style="margin: 0 0 8px 0; font-size: 11px; color: #666;">📍 ${truck.address}</p>` : ''}
      <p style="margin: 0; font-size: 12px; color: #ef4444; font-weight: 500;">${truck.distance.toFixed(1)} miles away</p>
    </div>
  `

  return new mapboxgl.Marker({ color: '#ef4444', scale: 1.3 })
    .setLngLat([truck.truckLng, truck.truckLat])
    .setPopup(new mapboxgl.Popup().setHTML(popupHTML))
    .addTo(map)
}

export const MapComponent = ({
  userLocation,
  foodTrucks
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.4194, 37.7749], // sf long lat by default
      zoom: 11,
      attributionControl: false
    })

    return () => map.current?.remove()
  }, [])

  useEffect(() => {
    if (!map.current) return

    const markers: mapboxgl.Marker[] = []

    if (userLocation) {
      markers.push(createUserMarker(userLocation, map.current))
    }

    if (foodTrucks.length > 0) {
      foodTrucks.forEach(truck => {
        markers.push(createTruckMarker(truck, map.current!))
      })

      const bounds = new mapboxgl.LngLatBounds()
      foodTrucks.forEach(truck =>
        bounds.extend([truck.truckLng, truck.truckLat])
      )

      map.current.fitBounds(bounds, {
        padding: 60,
        maxZoom: 14,
        duration: 1000
      })
    }

    return () => markers.forEach(marker => marker.remove())
  }, [userLocation, foodTrucks])

  return <div ref={mapContainer} className='w-full h-full rounded-lg' />
}
