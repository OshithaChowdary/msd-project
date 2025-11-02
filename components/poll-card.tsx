"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PollCardProps {
  id: string
  title: string
  description: string
  totalVotes: number
  optionCount: number
  active: boolean
  href: string
}

export function PollCard({ id, title, description, totalVotes, optionCount, active, href }: PollCardProps) {
  return (
    <Link href={href}>
      <Card className="p-6 hover:bg-card/80 transition-colors cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-grow">{title}</h3>
          <Badge variant={active ? "default" : "secondary"} className="ml-2 flex-shrink-0">
            {active ? "Active" : "Closed"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">{description}</p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
          </span>
          <span className="text-xs font-medium text-primary">
            {optionCount} option{optionCount !== 1 ? "s" : ""}
          </span>
        </div>
      </Card>
    </Link>
  )
}
