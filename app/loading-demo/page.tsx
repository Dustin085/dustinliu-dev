import { LoadingDemoPageClient } from "@/app/loading-demo/page.client"

export type UserProfile = {
    name: string,
    description: string,
}

export default async function LoadingDemoPage() {
    // 模擬資料載入
    const getUserProfile = () => {
        return new Promise<UserProfile>((resolve) => {
            setTimeout(() => {
                resolve({
                    name: 'Tester',
                    description: 'The best tester in the world.'
                })
            }, 3000)
        })
    }

    const userProfile = await getUserProfile();

    return (
        <LoadingDemoPageClient userProfile={userProfile} />
    )
}