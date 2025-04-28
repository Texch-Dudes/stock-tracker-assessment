'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    setUser(null)
    await auth.signOut()
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)