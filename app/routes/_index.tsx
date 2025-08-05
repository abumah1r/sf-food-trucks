import { Separator } from '@/components/ui'
import { MapComponent, LocationCard, FoodTruckList } from '@/components'
import { useGeolocation, useFoodTrucks } from '@/lib/hooks'

export function meta() {
  return [
    { title: 'SF Food Trucks' },
    { name: 'description', content: 'Welcome to SF Food Trucks!' }
  ]
}

export default function Home() {
  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation
  } = useGeolocation()
  const {
    closestTrucks,
    loading: trucksLoading,
    error: trucksError
  } = useFoodTrucks(location)

  return (
    <div className='min-h-screen p-6 lg:p-10'>
      <div className='space-y-6'>
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
          <div className='space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>
              SF Food Trucks
            </h2>
            <p className='text-muted-foreground'>
              Find the closest food truck near you to enjoy!
            </p>
          </div>
          <div className='lg:max-w-sm lg:flex-shrink-0'>
            <LocationCard
              location={location}
              loading={locationLoading}
              error={locationError}
              onGetLocation={getLocation}
            />
          </div>
        </div>

        <Separator />

        {location && (
          <FoodTruckList
            trucks={closestTrucks}
            loading={trucksLoading}
            error={trucksError}
          />
        )}

        <div className='h-[500px] lg:h-[600px] rounded-lg overflow-hidden'>
          <MapComponent userLocation={location} foodTrucks={closestTrucks} />
        </div>
      </div>
    </div>
  )
}
