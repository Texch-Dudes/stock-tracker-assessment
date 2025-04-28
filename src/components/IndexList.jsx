'use client'

import { useState } from 'react'

export default function IndexList({ indices, loading, onSelect, selectedIndex }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredIndices = indices.filter(index =>
    index.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    index.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search indices..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredIndices.map((index) => (
          <div
            key={index.symbol}
            className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
              selectedIndex?.symbol === index.symbol ? 'bg-blue-100' : ''
            }`}
            onClick={() => onSelect(index)}
          >
            <div className="font-medium">{index.description}</div>
            <div className="text-sm text-gray-500">{index.symbol}</div>
            <div className="text-sm">
              Price: {index.price ? `$${index.price.toFixed(2)}` : 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}