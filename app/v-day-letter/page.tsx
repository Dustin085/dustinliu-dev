import { VDayLetterPageClient } from "@/app/v-day-letter/page.client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Love Letter',
    description: 'A interactive love letter.'
}

export default function VDayLetterPage() {
    return (
        <VDayLetterPageClient />
    )
}