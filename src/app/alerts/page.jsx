'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import AlertList from '@/components/AlertList'
import axios from 'axios'

export default function Alerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [indices, setIndices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newAlert, setNewAlert] = useState({
    symbol: '',
    condition: 'above',
    price: '',
  })

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const alertsPromise = axios.get('/api/alerts')
        const indicesPromise = axios.get('/api/indices')

        const [alertsRes, indicesRes] = await Promise.all([
          alertsPromise.catch(err => {
            console.error('Error fetching alerts:', err)
            return { data: [] }
          }),
          indicesPromise.catch(err => {
            console.error('Error fetching indices:', err)
            return { data: [] }
          })
        ])

        setAlerts(alertsRes.data)
        setIndices(indicesRes.data)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to load data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    try {
      // Input validation
      if (!newAlert.symbol || !newAlert.price) {
        setError('Please select an index and enter a price')
        return
      }

      const price = parseFloat(newAlert.price)
      if (isNaN(price)) {
        setError('Please enter a valid price number')
        return
      }

      const response = await axios.post('/api/alerts', {
        ...newAlert,
        price: price
      })

      if (response.data.error) {
        throw new Error(response.data.error)
      }

      setAlerts(prev => [...prev, response.data])
      setNewAlert({
        symbol: '',
        condition: 'above',
        price: '',
      })
      setError(null)

    } catch (error) {
      console.error('Error creating alert:', error)
      setError(error.response?.data?.error || error.message || 'Failed to create alert')
    }
  }

  const handleDeleteAlert = async (id) => {
    try {
      await axios.delete(`/api/alerts/${id}`)
      setAlerts(prev => prev.filter(alert => alert.id !== id))
    } catch (error) {
      console.error('Error deleting alert:', error)
      setError('Failed to delete alert. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        Please login to view alerts
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Price Alerts</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Create New Alert</h2>
            <form onSubmit={handleCreateAlert} className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Index
                </label>
                <select
                  value={newAlert.symbol}
                  onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  disabled={loading || indices.length === 0}
                >
                  <option value="">Select an index</option>
                  {indices.map((index) => (
                    <option key={index.symbol} value={index.symbol}>
                      {index.description} ({index.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition
                </label>
                <select
                  value={newAlert.condition}
                  onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="above">Price above</option>
                  <option value="below">Price below</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={newAlert.price}
                  onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter target price"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Create Alert'}
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Alerts</h2>
            <AlertList
              alerts={alerts}
              indices={indices}
              loading={loading}
              onDelete={handleDeleteAlert}
            />
          </div>
        </div>
      </div>
    </div>
  )
}