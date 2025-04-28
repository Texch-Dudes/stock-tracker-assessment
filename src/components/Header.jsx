'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          Stock Tracker
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {user ? (
              <>
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/alerts" className="hover:underline">
                    Alerts
                  </Link>
                </li>
                <li>
                  <Link href="/statistics" className="hover:underline">
                    Statistics
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="hover:underline">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:underline">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}