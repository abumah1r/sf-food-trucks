import { Truck, Loader2 } from 'lucide-react'
import type { FoodTruckWithDistance } from '@/lib/types'

interface FoodTruckListProps {
  trucks: FoodTruckWithDistance[]
  loading: boolean
  error: string | null
}

export const FoodTruckList = ({
  trucks,
  loading,
  error
}: FoodTruckListProps) => {
  const isEmpty = trucks.length === 0
  const showLoading = loading && isEmpty
  const showEmpty = isEmpty && !loading && !error

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Truck className='h-5 w-5' />
        <h3 className='text-lg font-semibold'>
          Closest Food Trucks ({trucks.length}/5)
        </h3>
        {loading && <Loader2 className='h-4 w-4 animate-spin' />}
      </div>

      {error && <div className='text-center py-8 text-red-500'>{error}</div>}

      {showLoading && (
        <div className='text-center py-8 text-muted-foreground'>
          Loading food trucks...
        </div>
      )}

      {showEmpty && (
        <div className='text-center py-8 text-muted-foreground'>
          No food trucks found nearby
        </div>
      )}

      {!isEmpty && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
          {trucks.map(truck => (
            <div
              key={truck.objectid}
              className='p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-card h-[160px] flex flex-col'>
              <div className='flex justify-between items-start mb-3 h-[32px]'>
                <h4 className='font-medium text-sm leading-tight line-clamp-2 flex-1 pr-2'>
                  {truck.applicant}
                </h4>
                <span className='text-xs text-muted-foreground font-medium flex-shrink-0'>
                  {truck.distance.toFixed(1)} mi
                </span>
              </div>

              <div className='h-[48px] mb-2'>
                {truck.fooditems && (
                  <p className='text-xs text-muted-foreground line-clamp-4 leading-tight'>
                    {truck.fooditems}
                  </p>
                )}
              </div>

              <div className='mt-auto'>
                {truck.address && (
                  <p className='text-xs text-muted-foreground truncate'>
                    📍 {truck.address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
