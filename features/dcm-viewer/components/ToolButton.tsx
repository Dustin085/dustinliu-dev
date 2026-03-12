import { Button } from "@/components/ui/button"
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ── 工具按鈕 ──────────────────────────────────────────────────
export function ToolButton({
    icon,
    label,
    active,
    onClick,
    disabled,
}: {
    icon: React.ReactNode
    label: string
    active?: boolean
    onClick: () => void
    disabled?: boolean
}) {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={disabled}
                        onClick={onClick}
                        className={cn(
                            'h-9 w-9 rounded-none border border-transparent text-zinc-400',
                            'hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-600',
                            'transition-colors duration-100',
                            active &&
                            'bg-emerald-950 text-emerald-400 border-emerald-700 hover:bg-emerald-900 hover:text-emerald-300'
                        )}
                    >
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent
                    side="bottom"
                    className="bg-zinc-900 border-zinc-700 text-zinc-200 font-mono text-xs"
                >
                    {label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}