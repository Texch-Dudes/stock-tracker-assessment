'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import axios from 'axios'

export default function Statistics() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/statistics')
        setStats(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching statistics:', error)
        setLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  if (!user) {
    return <div>Please login to view statistics</div>
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">API Usage Statistics</h1>
        
        {loading ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : stats ? (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="font-semibold mb-2">API Plan</h3>
                <p>{stats.plan}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="font-semibold mb-2">API Calls Today</h3>
                <p>{stats.callsToday} / {stats.callsLimit}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="font-semibold mb-2">API Calls This Month</h3>
                <p>{stats.callsMonth} / {stats.callsLimit}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="font-semibold mb-2">Remaining Calls</h3>
                <p>{stats.remainingCalls}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <p>No statistics available.</p>
          </div>
        )}
      </div>
    </div>
  )
}