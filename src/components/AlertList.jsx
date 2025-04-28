'use client'

export default function AlertList({ alerts, indices, loading, onDelete }) {
  const getIndexName = (symbol) => {
    const index = indices.find(i => i.symbol === symbol)
    return index ? index.description : symbol
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <p>No alerts set up yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-3 border border-gray-200 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{getIndexName(alert.symbol)}</div>
                <div className="text-sm">
                  Alert when price is {alert.condition} ${alert.price}
                </div>
              </div>
              <button
                onClick={() => onDelete(alert.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}