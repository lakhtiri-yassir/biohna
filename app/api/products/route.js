import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireFields } from '@/lib/validation'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const category = searchParams.get('category')
    const vendor = searchParams.get('vendor')
    const search = searchParams.get('search')
    const bio = searchParams.get('bio') === 'true'
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : undefined
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    
    // Build where clause dynamically
    const where = {
      status: 'ACTIVE',
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      }),
      ...(bio && { bioCertified: true }),
      ...(minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: minPrice }),
          ...(maxPrice && { lte: maxPrice })
        }
      },
      ...(vendor && { vendorId: vendor }),
      ...(category && {
        category: {
          slug: category
        }
      })
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        pictures: {
          take: 1,
          orderBy: { displayOrder: 'asc' }
        },
        vendor: {
          select: { storeName: true, id: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products GET error:', error)
    return errorResponse('Failed to fetch products', 500)
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { vendorId, categoryId, name, description, price, stockQuantity, bioCertified, pictures = [] } = body
    
    // Validate required fields
    const missing = requireFields(body, ['vendorId', 'name', 'price'])
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Create product with pictures
    const product = await prisma.product.create({
      data: {
        vendorId,
        categoryId,
        name,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity || 0, 10),
        bioCertified: Boolean(bioCertified),
        status: 'ACTIVE',
        ...(pictures.length > 0 && {
          pictures: {
            createMany: {
              data: pictures.map((url, index) => ({
                url,
                displayOrder: index + 1
              }))
            }
          }
        })
      },
      include: {
        pictures: true,
        vendor: {
          select: { storeName: true, id: true }
        },
        category: {
          select: { name: true, slug: true }
        }
      }
    })

    return successResponse(product, 201)
  } catch (error) {
    console.error('Products POST error:', error)
    
    if (error.code === 'P2002') {
      return errorResponse('A product with this name already exists for this vendor', 409)
    }
    
    if (error.code === 'P2003') {
      return errorResponse('Invalid vendor or category ID', 400)
    }
    
    return errorResponse('Failed to create product', 500)
  }
}