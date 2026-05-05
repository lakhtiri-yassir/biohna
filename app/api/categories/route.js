import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(request) {
  try {
    // Get root categories with their children (two-level tree)
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true // Support for sub-subcategories
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return successResponse(categories)
  } catch (error) {
    console.error('Categories GET error:', error)
    return errorResponse('Failed to fetch categories', 500)
  }
}