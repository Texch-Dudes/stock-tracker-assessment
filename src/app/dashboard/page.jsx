'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import IndexList from '@/components/IndexList'
import Chart from '@/components/Chart'
import axios from 'axios'

export default function Dashboard() {
  const { user } = useAuth()
  const [indices, setIndices] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await axios.get('/api/indices')
        setIndices(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching indices:', error)
        setLoading(false)
      }
    }

    fetchIndices()
  }, [])

  useEffect(() => {
    if (selectedIndex) {
      const fetchChartData = async () => {
        try {
          const response = await axios.get(`/api/indices/${selectedIndex.symbol}/chart`)
          setChartData(response.data)
        } catch (error) {
          console.error('Error fetching chart data:', error)
        }
      }

      fetchChartData()
    }
  }, [selectedIndex])

  if (!user) {
    return <div>Please login to view the dashboard</div>
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Stock Indices Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <IndexList 
              indices={indices} 
              loading={loading}
              onSelect={setSelectedIndex}
              selectedIndex={selectedIndex}
            />
          </div>
          <div className="md:col-span-2">
            {selectedIndex ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">{selectedIndex.description}</h2>
                <Chart data={chartData} />
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow">
                <p>Select an index to view its chart</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}