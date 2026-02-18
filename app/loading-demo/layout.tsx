export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:v-day-letter-bg">
            <main className="flex min-h-screen w-full flex-col items-center justify-center gap-16 px-12 py-8 bg-white dark:v-day-letter-bg dark:text-gray-800">
                {children}
            </main>
        </div>
    )
}