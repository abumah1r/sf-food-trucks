import { MapPin, Loader2 } from 'lucide-react'
import type { UserLocation } from '@/lib/types'

interface LocationCardProps {
  location: UserLocation | null
  loading: boolean
  error: string | null
  onGetLocation: () => void
}

export const LocationCard = ({
  location,
  loading,
  error,
  onGetLocation
}: LocationCardProps) => {
  const showInitial = !location && !loading
  const secondaryButtonClass =
    'px-3 py-1.5 border border-border rounded-md text-xs hover:bg-muted/50 transition-colors'

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-sm font-medium'>
        <MapPin className='h-4 w-4' />
        Your Location
      </div>

      {showInitial && (
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground'>
            Find food trucks near you
          </p>
          <button
            onClick={onGetLocation}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors'>
            Get My Location
          </button>
        </div>
      )}

      {loading && (
        <div className='flex items-center gap-2 py-2'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span className='text-sm text-muted-foreground'>
            Finding location...
          </span>
        </div>
      )}

      {location && (
        <div className='space-y-3'>
          {location.fullAddress && (
            <p className='text-sm text-muted-foreground leading-relaxed max-w-xs'>
              {location.fullAddress}
            </p>
          )}
          <button
            onClick={onGetLocation}
            disabled={loading}
            className={secondaryButtonClass}>
            Update Location
          </button>
        </div>
      )}

      {error && (
        <div className='space-y-3'>
          <div className='text-red-500 text-sm'>{error}</div>
          <button onClick={onGetLocation} className={secondaryButtonClass}>
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
