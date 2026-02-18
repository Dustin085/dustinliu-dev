import { ProfileCard } from "@/app/loading-demo/page.client"
import { Skeleton } from "@/components/ui/skeleton"

const skeletonTone = "bg-muted/40"

export default function Loading() {
    return (
        <>
            <div className="text-2xl font-bold">Loading...</div>

            <ProfileCard>
                <Skeleton className={`w-10 h-10 rounded-full ${skeletonTone}`} />
                <div className="flex flex-col gap-2">
                    <Skeleton className={`w-24 h-3 ${skeletonTone}`} />
                    <Skeleton className={`w-32 h-3 ${skeletonTone}`} />
                </div>
            </ProfileCard>
        </>
    )
}