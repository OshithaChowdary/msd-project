"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, BarChart3, LogOut } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface Poll {
  id: string
  title: string
  description: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  active: boolean
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const stored = localStorage.getItem("voting_polls")
    if (stored) {
      setPolls(JSON.parse(stored))
    }
    setLoading(false)
  }, [user, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome, {user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Poll
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 bg-transparent" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Active Polls</h2>
          <p className="text-muted-foreground">Manage and monitor your polls</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : polls.length === 0 ? (
          <Card className="p-8 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No polls yet. Create one to get started!</p>
            <Link href="/admin">
              <Button className="mt-4">Create Your First Poll</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {polls
              .filter((p) => p.active)
              .map((poll) => (
                <Link key={poll.id} href={`/poll/${poll.id}`}>
                  <Card className="p-6 hover:bg-card/80 transition-colors cursor-pointer h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{poll.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{poll.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs font-medium text-primary">{poll.options.length} options</span>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        )}
      </div>
    </main>
  )
}
