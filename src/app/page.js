"use client"
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        } else {
            router.push('/login')
        }
    }, [])

    return (
        <div>
            Loading...
        </div>
    )
}

export default Page