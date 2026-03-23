import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
    className?: string
    size?: number
    fullScreen?: boolean
    text?: string
}

export default function LoadingSpinner({
    className = '',
    size = 32,
    fullScreen = false,
    text = 'Loading...'
}: LoadingSpinnerProps) {
    const content = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 className="animate-spin text-blue-500" size={size} strokeWidth={2} />
            {text && (
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                    {text}
                </span>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
                {content}
            </div>
        )
    }

    return (
        <div className="flex w-full items-center justify-center py-12">
            {content}
        </div>
    )
}
