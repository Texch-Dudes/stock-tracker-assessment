import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_API_KEY
    // Note: Finnhub doesn't provide usage stats in their free tier
    // This is a mock response - in a real app you'd track this yourself
    const stats = {
      plan: 'Free',
      callsToday: 42,
      callsMonth: 89,
      callsLimit: 100,
      remainingCalls: 11,
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}