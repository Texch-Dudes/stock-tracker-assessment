import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminDb } from '@/config/firebase-admin'

const db = getFirestore()

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized')
    }
    await db.collection('alerts').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}