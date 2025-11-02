"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, BarChart3, LogIn } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PollCard } from "@/components/poll-card"

interface Poll {
  id: string
  title: string
  description: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  active: boolean
  createdAt: string
}

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolls = () => {
      const stored = localStorage.getItem("voting_polls")
      if (stored) {
        setPolls(JSON.parse(stored))
      }
      setLoading(false)
    }

    fetchPolls()

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchPolls, 2000)
    return () => clearInterval(interval)
  }, [])

  const activePolls = polls.filter((p) => p.active)
  const closedPolls = polls.filter((p) => !p.active)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">VoteHub</h1>
            <p className="text-muted-foreground text-sm mt-1">Secure & Simple Voting System</p>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline" className="gap-2 bg-transparent">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Poll
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Active Polls</h2>
          <p className="text-muted-foreground mb-6">Vote on the latest community polls</p>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : activePolls.length === 0 ? (
            <Card className="p-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-4">No active polls yet</p>
              <p className="text-muted-foreground text-sm">Be the first to create a poll by signing in</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activePolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  id={poll.id}
                  title={poll.title}
                  description={poll.description}
                  totalVotes={poll.totalVotes}
                  optionCount={poll.options.length}
                  active={poll.active}
                  href={`/poll/${poll.id}`}
                />
              ))}
            </div>
          )}
        </div>

        {closedPolls.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Closed Polls</h2>
            <p className="text-muted-foreground mb-6">View results from completed polls</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {closedPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  id={poll.id}
                  title={poll.title}
                  description={poll.description}
                  totalVotes={poll.totalVotes}
                  optionCount={poll.options.length}
                  active={poll.active}
                  href={`/poll/${poll.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
