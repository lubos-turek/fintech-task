import { NextRequest, NextResponse } from 'next/server'
import { searchCategoriesFull } from '@/lib/fts5'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim() === '') {
      return NextResponse.json([])
    }

    const categories = await searchCategoriesFull(query.trim(), 25)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error searching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

