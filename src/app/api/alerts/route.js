import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { adminDb } from '@/config/firebase-admin'

const db = getFirestore()

export async function GET() {
  try {
    // Verify Firebase connection
    if (!adminDb) {
      throw new Error('Firebase Admin not initialized')
    }

    const snapshot = await db.collection('alerts').get()

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 })
    }

    const alerts = snapshot.docs.map(doc => {
      const data = doc.data();
      // Safely handle the createdAt field
      let createdAt;
      
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        // It's a Firestore Timestamp
        createdAt = data.createdAt.toDate().toISOString();
      } else if (data.createdAt) {
        // It's already a date or string - use as is
        createdAt = new Date(data.createdAt).toISOString();
      } else {
        // No createdAt field - use current date
        createdAt = new Date().toISOString();
      }

      return {
        id: doc.id,
        ...data,
        createdAt
      };
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts', details: error.message },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const { symbol, condition, price } = await request.json()

    // Input validation
    if (!symbol || !condition || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const priceNumber = parseFloat(price)
    if (isNaN(priceNumber)) {
      return NextResponse.json(
        { error: 'Price must be a number' },
        { status: 400 }
      )
    }

    const alertData = {
      symbol,
      condition,
      price: priceNumber,
      createdAt: new Date().toISOString(),
      userId: 'user-id-placeholder' // You'll need to get this from auth
    }

    const docRef = await db.collection('alerts').add(alertData)

    return NextResponse.json(
      { id: docRef.id, ...alertData },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating alert:', error)
    return NextResponse.json(
      { error: 'Failed to create alert', details: error.message },
      { status: 500 }
    )
  }
}