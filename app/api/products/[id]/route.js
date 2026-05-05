import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Get product with full details
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        pictures: {
          orderBy: { displayOrder: 'asc' }
        },
        vendor: true,
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                picture: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!product) {
      return errorResponse('Product not found', 404)
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    // Add computed fields
    const productWithRating = {
      ...product,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: product.reviews.length
    }

    return successResponse(productWithRating)
  } catch (error) {
    console.error('Product GET error:', error)
    return errorResponse('Failed to fetch product', 500)
  }
}