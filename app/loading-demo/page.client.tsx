'use client'

import { UserProfile } from "@/app/loading-demo/page";
import Image from "next/image";

type Props = {
    userProfile: UserProfile
}

export function LoadingDemoPageClient({ userProfile }: Props) {
    return (
        <>
            <div className="text-2xl font-bold">Loading Finished !!</div>
            <ProfileCard>
                <Avatar src="/love-cats.gif" alt="user avatar" />
                <div>
                    <p>{userProfile.name}</p>
                    <p className="text-sm">{userProfile.description}</p>
                </div>
            </ProfileCard>
        </>
    )
}

export function ProfileCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-2 items-center-safe py-2 px-4 rounded-lg border border-gray-600 bg-gray-200">
            {children}
        </div>
    )
}


export function Avatar({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="relative w-10 h-10 overflow-hidden rounded-full bg-muted">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
            />
        </div>
    )
}