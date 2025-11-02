"use client"

import { useState, useEffect, useCallback } from "react"

interface Poll {
  id: string
  title: string
  description: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  active: boolean
  createdAt: string
}

export function usePolls() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch polls from localStorage and set up polling
  useEffect(() => {
    const fetchPolls = () => {
      try {
        const stored = localStorage.getItem("voting_polls")
        if (stored) {
          setPolls(JSON.parse(stored))
        }
        setError(null)
      } catch (err) {
        setError("Failed to load polls")
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()

    // Poll for updates every 2 seconds
    const interval = setInterval(fetchPolls, 2000)
    return () => clearInterval(interval)
  }, [])

  const createPoll = useCallback(
    (newPoll: Poll) => {
      const updated = [...polls, newPoll]
      setPolls(updated)
      localStorage.setItem("voting_polls", JSON.stringify(updated))
    },
    [polls],
  )

  const updatePoll = useCallback(
    (pollId: string, updates: Partial<Poll>) => {
      const updated = polls.map((p) => (p.id === pollId ? { ...p, ...updates } : p))
      setPolls(updated)
      localStorage.setItem("voting_polls", JSON.stringify(updated))
    },
    [polls],
  )

  const deletePoll = useCallback(
    (pollId: string) => {
      const updated = polls.filter((p) => p.id !== pollId)
      setPolls(updated)
      localStorage.setItem("voting_polls", JSON.stringify(updated))
    },
    [polls],
  )

  return {
    polls,
    loading,
    error,
    createPoll,
    updatePoll,
    deletePoll,
  }
}
