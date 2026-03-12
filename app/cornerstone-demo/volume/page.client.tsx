'use client'

import dynamic from 'next/dynamic'

const CornerstoneVolume = dynamic(
    () => import('@/features/dcm-viewer/CornerstoneVolume').then(
        (mod) => mod.CornerstoneVolume
    ),
    { ssr: false }
)

export default function CornerstoneVolumePageClient() {
    return (
        <main className='h-dvh w-full flex flex-col items-center-safe justify-center-safe'>
            <h2>Cornerstone Volume Page Client</h2>
            <CornerstoneVolume />
        </main>
    )
}