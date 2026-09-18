"use client"

import { useInView } from "motion/react"
import { useRef, useState, useEffect } from "react"

import { Loader } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader } from "@jp/ui/components/card"

type Props = {
  index: number
  started: boolean
}

const LOADER_TIME = 1
const BAR_TIME = 0.5
const STEP_GAP = 0.1

const STEP_DURATION = LOADER_TIME + BAR_TIME + STEP_GAP

export function GettingStartedList({
  steps,
}: {
  steps: { title: string; description: string }[]
}) {
  const triggerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(triggerRef, { once: true, margin: "-40px" })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (isInView) setStarted(true)
  }, [isInView])

  return (
    <div
      ref={triggerRef}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4"
    >
      {steps.map((step, index) => (
        <Card
          className="bg-transparent pt-1.5 pb-0 shadow-none ring-0"
          key={step.title + index}
        >
          <GettingStartedProgress key={index} index={index} started={started} />
          <CardHeader className="px-0">
            <span className="inline-flex size-12 items-center justify-center rounded-xl border bg-background text-lg font-semibold text-primary shadow-xs">
              {`${index + 1}`.padStart(2, "0")}
            </span>
          </CardHeader>
          <CardContent className="space-y-3 px-0">
            <h3 className="font-heading text-3xl font-semibold">
              {step.title}
            </h3>
            <p className="text-base opacity-80">{step.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function GettingStartedProgress({ index, started }: Props) {
  const baseDelay = index * STEP_DURATION

  return (
    <div className="flex items-center gap-2">
      {/* ICON */}
      <div className="relative flex size-6 items-center justify-center">
        {/* PLACEHOLDER */}
        <motion.div
          className="absolute size-5 rounded-full bg-foreground/20"
          initial={{ opacity: 1 }}
          animate={started ? { opacity: 0 } : { opacity: 1 }}
          transition={{ delay: baseDelay, duration: 0.15 }}
        />

        {/* LOADER */}
        <motion.div
          className="absolute"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ delay: baseDelay, duration: LOADER_TIME }}
        >
          <Loader className="text-highlight size-5 animate-spin" />
        </motion.div>

        {/* CHECK */}
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute size-6 fill-primary"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            started ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
          }
          transition={{
            delay: baseDelay + LOADER_TIME,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
        </motion.svg>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/20">
        <motion.div
          className="bg-highlight h-full origin-left"
          initial={{ scaleX: 0 }}
          animate={started ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            delay: baseDelay + LOADER_TIME,
            duration: BAR_TIME,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  )
}
