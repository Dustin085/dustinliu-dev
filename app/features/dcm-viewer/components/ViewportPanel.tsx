import { cn } from "@/lib/utils"

// 顯示影像的面板
export function ViewportPanel({
    label,
    divRef,
    className,
}: {
    label: string
    divRef: React.RefObject<HTMLDivElement | null>
    className?: string
}) {
    return (
        <div
            className={cn(
                'relative flex-1 min-w-0 border border-zinc-700 bg-black group',
                className
            )}
            onContextMenu={(e) => { e.preventDefault() }}
        >
            {/* 左上角標籤 */}
            <span className="absolute top-2 left-2 z-10 font-mono text-xs text-emerald-400 tracking-widest select-none pointer-events-none">
                {label}
            </span>
            {/* 十字準心 */}
            {/* <div className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/30" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/30" />
            </div> */}
            <div ref={divRef} className="w-full h-full" />
        </div>
    )
}