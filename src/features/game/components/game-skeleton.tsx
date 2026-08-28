import { Skeleton } from '@/components/ui/skeleton'

export function GameSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8" />
      </div>
      <div className="flex flex-col gap-3 pt-4 sm:flex-row">
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 sm:w-32" />
      </div>
    </div>
  )
}
