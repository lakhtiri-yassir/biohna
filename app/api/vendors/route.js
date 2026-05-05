import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'

export async function GET(request) {
  try {
    const vendors = await prisma.vendor.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      },
      orderBy: { storeName: 'asc' }
    })

    // Transform the response to include productCount
    const vendorsWithCount = vendors.map(vendor => ({
      ...vendor,
      productCount: vendor._count.products,
      _count: undefined // Remove the _count field
    }))

    return successResponse(vendorsWithCount)
  } catch (error) {
    console.error('Vendors GET error:', error)
    return errorResponse('Failed to fetch vendors', 500)
  }
}