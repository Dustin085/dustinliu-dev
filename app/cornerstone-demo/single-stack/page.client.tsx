'use client'

import dynamic from 'next/dynamic'

// import { CornerstoneViewer } from "@/app/features/dcm-viewer/CornerstoneViewer"

const CornerstoneViewer = dynamic(
    () => import('@/app/features/dcm-viewer/CornerstoneViewer').then(
        (mod) => mod.CornerstoneViewer
    ),
    { ssr: false }
)

export default function CornerstoneDemoPageClient() {
    return (
        <main className='h-dvh w-full flex flex-col items-center-safe justify-center-safe'>
            <h2>Cornerstone Demo</h2>
            <CornerstoneViewer />
        </main>
    )
}