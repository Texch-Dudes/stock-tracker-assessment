'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Chart({ data }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (data && data.prices) {
      setLoading(false)
    }
  }, [data])

  if (loading) {
    return <div className="bg-white p-4 rounded-lg shadow">Loading chart...</div>
  }

  if (!data || !data.prices) {
    return <div className="bg-white p-4 rounded-lg shadow">No chart data available</div>
  }

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Price',
        data: data.prices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Price History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  )
}