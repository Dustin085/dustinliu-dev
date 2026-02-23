import CornerstoneVolumePageClient from "@/app/cornerstone-demo/volume/page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cornerstone Volume",
    description: "Demo for cornerstone.js."
}

export default function CornerstoneVolumePage() {
    return (
        <CornerstoneVolumePageClient />
    )
}