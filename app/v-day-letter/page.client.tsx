'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { AnimatePresence, motion } from "framer-motion";

type step = {
    text: string,
    twClassName: string,
}

type BtnStep = {
    yes: step,
    no: step,
    imageUrl: string,
}

export function VDayLetterPageClient() {
    const [isSheSaidYes, setIsSheSaidYes] = useState<boolean>(false)
    const [step, setStep] = useState<number>(0)

    const btnSteps: BtnStep[] = [
        {
            yes: {
                text: 'Yes',
                twClassName: 'text-3xl h-16 px-8',
            },
            no: {
                text: 'No',
                twClassName: 'text-lg h-10 px-4',
            },
            imageUrl: '/wonder-stitch.gif',
        },
        {
            yes: {
                text: 'Yes',
                twClassName: 'text-6xl h-36 px-12',
            },
            no: {
                text: 'No, please.',
                twClassName: 'text-base h-9 px-3',
            },
            imageUrl: '/wonder-stitch-002.gif',

        },
        {
            yes: {
                text: 'Yes',
                twClassName: 'text-8xl h-48 px-16',
            },
            no: {
                text: "No, please don't refuse.",
                twClassName: 'text-base h-9 px-3',
            },
            imageUrl: '/cry-stitch.gif',

        },
        {
            yes: {
                text: 'Yes',
                twClassName: 'text-8xl h-54 px-20',
            },
            no: {
                text: "No, I really hope you won't say no.",
                twClassName: 'text-base h-9 px-3',
            },
            imageUrl: '/cry-umaru.gif',

        },
        {
            yes: {
                text: 'Yes',
                twClassName: 'text-8xl h-58 px-24',
            },
            no: {
                text: 'No, please, it really matters to me.',
                twClassName: 'text-base h-9 px-3',
            },
            imageUrl: '/cry-anya.gif',

        },
        {
            yes: {
                text: 'Yes',
                twClassName: 'text-8xl h-64 px-32',
            },
            no: {
                text: "Give me a chance?",
                twClassName: 'text-base h-9 px-3',
            },
            imageUrl: '/cry-deno.gif',

        }
    ]

    const handleYesClick = () => {
        setIsSheSaidYes(true)
        // Fire confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }

    const handleNoClick = () => {
        if (step < btnSteps.length - 1) {
            setStep(prev => {
                if (prev >= btnSteps.length - 1) return prev
                return prev + 1
            })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:v-day-letter-bg">
            <main className="flex min-h-screen w-full flex-col items-center justify-center gap-16 px-16 bg-white dark:v-day-letter-bg dark:text-gray-800">
                <h2 className={`text-6xl text-pink-800 font-bold ${isSheSaidYes ? 'wiggle-once' : 'rotate-once'}`}>
                    {isSheSaidYes ?
                        'Knew You Gonna Say Yes. 😊'
                        : 'Would You Marry Me ? 💗'}
                </h2>
                {/* Mood Image */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSheSaidYes ? '/love-cats.gif' : btnSteps[step].imageUrl} // key 變化會觸發動畫
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image src={isSheSaidYes ? '/love-cats.gif' : btnSteps[step].imageUrl} alt={btnSteps[step].imageUrl} width={200} height={200} unoptimized />
                    </motion.div>
                </AnimatePresence>
                <div className="flex items-center-safe justify-center-safe gap-6">
                    {/* Before She Said Yes */}
                    {
                        !isSheSaidYes &&
                        <div className="flex flex-col lg:flex-row items-center-safe justify-center-safe gap-4">
                            {/* Yes Button */}
                            <Button
                                variant={"success"}
                                size={"xl"}
                                className={cn(btnSteps[step].yes.twClassName, 'text-gray-800')}
                                onClick={handleYesClick}
                            >{btnSteps[step].yes.text}</Button>
                            {/* No Button */}
                            <NoButton
                                text={btnSteps[step].no.text}
                                twClassName={btnSteps[step].no.twClassName}
                                handleNoClick={handleNoClick}
                                isFlying={step >= btnSteps.length - 1}
                            />
                        </div>
                    }
                    {/* After She Said Yes */}
                    {
                        isSheSaidYes &&
                        <h2 className="text-4xl text-pink-800">💕 Love You. 💕</h2>
                    }
                </div>
            </main>
        </div>
    )
}

type NoButtonProps = {
    text: string,
    twClassName: string,
    handleNoClick: () => void,
    isFlying: boolean,
}

function NoButton({ text, twClassName, handleNoClick, isFlying }: NoButtonProps) {
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const ref = useRef<HTMLButtonElement>(null)
    // Trigger for random flying
    const [trigger, setTrigger] = useState<number>(0);

    const handleRandomPosition = () => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()

        const maxX = window.innerWidth - rect.width
        const maxY = window.innerHeight - rect.height

        setPosition({
            left: Math.random() * maxX,
            top: Math.random() * maxY,
        })
    }

    // Set initial random position
    useEffect(() => {
        handleRandomPosition()
    }, [])

    // Random flying
    useLayoutEffect(() => {
        if (!isFlying) return
        handleRandomPosition()
    }, [trigger, isFlying])

    return (
        <Button
            variant={"destructive"}
            className={cn(twClassName, 'text-gray-800',
                isFlying ? 'absolute' : '')}
            style={{ top: position.top, left: position.left }}
            onClick={() => {
                handleNoClick();
                setTrigger(prev => prev + 1)
            }}
            ref={ref}
        >{text}</Button>
    )
}