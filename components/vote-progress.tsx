"use client"

import { Progress } from "@/components/ui/progress"

interface VoteProgressProps {
  label: string
  votes: number
  percentage: number
  isHighest?: boolean
}

export function VoteProgress({ label, votes, percentage, isHighest }: VoteProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${isHighest ? "font-semibold text-primary" : "text-foreground"}`}>{label}</span>
        <span className="text-sm text-muted-foreground">
          {votes} vote{votes !== 1 ? "s" : ""} ({percentage}%)
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  )
}
