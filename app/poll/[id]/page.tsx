"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VoteProgress } from "@/components/vote-progress"

interface Option {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  title: string
  description: string
  options: Option[]
  totalVotes: number
  active: boolean
}

export default function PollPage() {
  const params = useParams()
  const pollId = params.id as string
  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPoll = () => {
      const polls = JSON.parse(localStorage.getItem("voting_polls") || "[]")
      const found = polls.find((p: Poll) => p.id === pollId)
      if (found) {
        setPoll(found)
        const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "[]")
        setHasVoted(votedPolls.includes(pollId))
      }
      setLoading(false)
    }

    fetchPoll()

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchPoll, 2000)
    return () => clearInterval(interval)
  }, [pollId])

  const handleVote = (optionId: string) => {
    if (!poll || hasVoted || !poll.active) return

    const updatedPoll = {
      ...poll,
      options: poll.options.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)),
      totalVotes: poll.totalVotes + 1,
    }

    const polls = JSON.parse(localStorage.getItem("voting_polls") || "[]")
    const updatedPolls = polls.map((p: Poll) => (p.id === pollId ? updatedPoll : p))
    localStorage.setItem("voting_polls", JSON.stringify(updatedPolls))

    const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "[]")
    votedPolls.push(pollId)
    localStorage.setItem("voted_polls", JSON.stringify(votedPolls))

    setPoll(updatedPoll)
    setSelectedOption(optionId)
    setHasVoted(true)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  if (!poll) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Link href="/">
            <Button variant="outline" className="mb-6 gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Polls
            </Button>
          </Link>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Poll not found</p>
          </Card>
        </div>
      </main>
    )
  }

  const maxVotes = Math.max(...poll.options.map((o) => o.votes), 1)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Polls
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{poll.title}</h1>
          <p className="text-muted-foreground mt-2">{poll.description}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {hasVoted && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">Thank you for voting!</p>
          </div>
        )}

        {!poll.active && (
          <div className="mb-6 p-4 bg-muted border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">This poll is closed and no longer accepting votes.</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {poll.options.map((option) => {
            const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
            const isSelected = selectedOption === option.id

            return (
              <button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={hasVoted || !poll.active}
                className="w-full text-left"
              >
                <Card
                  className={`p-6 transition-all ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-card/80"
                  } ${!poll.active || hasVoted ? "cursor-default" : "cursor-pointer"}`}
                >
                  <VoteProgress
                    label={option.text}
                    votes={option.votes}
                    percentage={percentage}
                    isHighest={option.votes === maxVotes && maxVotes > 0}
                  />
                </Card>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Votes</p>
            <p className="text-3xl font-bold text-primary">{poll.totalVotes}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Status</p>
            <p className={`text-3xl font-bold ${poll.active ? "text-primary" : "text-muted-foreground"}`}>
              {poll.active ? "Active" : "Closed"}
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}
