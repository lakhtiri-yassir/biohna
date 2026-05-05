import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        products: {
          where: { status: 'ACTIVE' },
          include: {
            pictures: {
              take: 1,
              orderBy: { displayOrder: 'asc' }
            },
            category: {
              select: { name: true, slug: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!vendor) {
      return errorResponse('Vendor not found', 404)
    }

    return successResponse(vendor)
  } catch (error) {
    console.error('Vendor GET error:', error)
    return errorResponse('Failed to fetch vendor', 500)
  }
}