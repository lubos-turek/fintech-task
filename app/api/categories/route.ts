import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const parentPath = searchParams.get('parentPath')

    if (!parentPath) {
      return NextResponse.json(
        { error: 'parentPath parameter is required' },
        { status: 400 }
      )
    }

    const categories = await prisma.imageNetCategory.findMany({
      where: {
        parentPath: parentPath
      },
      orderBy: {
        path: 'asc'
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

