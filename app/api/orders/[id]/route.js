import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                pictures: {
                  take: 1,
                  orderBy: { displayOrder: 'asc' }
                }
              }
            },
            vendor: {
              select: { storeName: true }
            }
          }
        },
        shipping: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    if (!order) {
      return errorResponse('Order not found', 404)
    }

    return successResponse(order)
  } catch (error) {
    console.error('Order GET error:', error)
    return errorResponse('Failed to fetch order', 500)
  }
}