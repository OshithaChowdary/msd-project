"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2, Lock, Unlock, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Poll {
  id: string
  title: string
  description: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  active: boolean
  createdAt: string
}

export default function AdminPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", "", "", ""],
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("voting_polls")
    if (stored) {
      setPolls(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validOptions = formData.options
      .filter((opt) => opt.trim())
      .map((opt, idx) => ({
        id: `opt-${idx}`,
        text: opt.trim(),
        votes: 0,
      }))

    if (!formData.title.trim() || validOptions.length < 2) {
      alert("Please provide a title and at least 2 options")
      return
    }

    const newPoll: Poll = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      options: validOptions,
      totalVotes: 0,
      active: true,
      createdAt: new Date().toISOString(),
    }

    const updatedPolls = [...polls, newPoll]
    setPolls(updatedPolls)
    localStorage.setItem("voting_polls", JSON.stringify(updatedPolls))

    setFormData({ title: "", description: "", options: ["", "", "", ""] })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const togglePollStatus = (pollId: string) => {
    const updatedPolls = polls.map((p) => (p.id === pollId ? { ...p, active: !p.active } : p))
    setPolls(updatedPolls)
    localStorage.setItem("voting_polls", JSON.stringify(updatedPolls))
  }

  const deletePoll = (pollId: string) => {
    if (confirm("Are you sure you want to delete this poll?")) {
      const updatedPolls = polls.filter((p) => p.id !== pollId)
      setPolls(updatedPolls)
      localStorage.setItem("voting_polls", JSON.stringify(updatedPolls))
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your polls</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {submitted && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground">✓ Poll created successfully!</p>
          </div>
        )}

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Create New Poll</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Poll Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What is your favorite...?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add context or details about this poll..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Options (at least 2) *</label>
              <div className="space-y-2">
                {formData.options.map((option, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.options]
                      newOptions[idx] = e.target.value
                      setFormData({ ...formData, options: newOptions })
                    }}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Option ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Create Poll
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Existing Polls</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : polls.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No polls yet. Create one to get started!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {polls.map((poll) => (
                <Card key={poll.id} className="p-6 hover:bg-card/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{poll.title}</h3>
                        <Badge variant={poll.active ? "default" : "secondary"}>
                          {poll.active ? "Active" : "Closed"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{poll.description}</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <p className="text-2xl font-bold text-primary">{poll.totalVotes}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">votes</p>
                    </div>
                  </div>

                  <div className="mb-4 py-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Options ({poll.options.length})</p>
                    <div className="space-y-1">
                      {poll.options.map((opt) => (
                        <div key={opt.id} className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>• {opt.text}</span>
                          <span className="font-medium text-foreground">{opt.votes}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" onClick={() => togglePollStatus(poll.id)} className="gap-2">
                      {poll.active ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Close
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Reopen
                        </>
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deletePoll(poll.id)} className="gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
