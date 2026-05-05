import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireFields, isValidRating } from '@/lib/validation'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, productId, rating, content } = body
    
    // Validate required fields
    const missing = requireFields(body, ['userId', 'productId', 'rating'])
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Validate rating
    if (!isValidRating(rating)) {
      return errorResponse('Rating must be an integer between 1 and 5')
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        content: content || null
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            picture: true
          }
        },
        product: {
          select: {
            name: true
          }
        }
      }
    })

    return successResponse(review, 201)
  } catch (error) {
    console.error('Reviews POST error:', error)
    
    // Handle duplicate review constraint
    if (error.code === 'P2002') {
      return errorResponse('You have already reviewed this product', 409)
    }
    
    // Handle foreign key violations
    if (error.code === 'P2003') {
      return errorResponse('Invalid user or product ID', 400)
    }
    
    return errorResponse('Failed to create review', 500)
  }
}