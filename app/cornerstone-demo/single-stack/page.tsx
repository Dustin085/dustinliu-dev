import CornerStoneDemoPageClient from "@/app/cornerstone-demo/single-stack/page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cornerstone Single Stack",
    description: "Demo for cornerstone.js."
}

export default function CornerstoneDemoPage() {
    return (
        <CornerStoneDemoPageClient />
    )
}