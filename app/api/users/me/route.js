import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401)
    }
    
    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
        settings: true,
        addresses: true
      }
    })

    if (!user) {
      return errorResponse('User not found', 404)
    }

    return successResponse(user)
  } catch (error) {
    console.error('Users GET error:', error)
    return errorResponse('Failed to fetch user', 500)
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    const userId = session.user.id

    await prisma.$transaction(async (tx) => {
      // 1. Wipe PII and soft-delete the user
      await tx.user.update({
        where: { id: userId },
        data: {
          firstName: 'Compte',
          lastName: 'Supprimé',
          phone: null,
          picture: null,
          deletedAt: new Date(),
        }
      })

      // 2. Remove personal addresses
      await tx.address.deleteMany({ where: { userId } })

      // 3. If vendor: handle active orders and clean up products
      const vendor = await tx.vendor.findUnique({ where: { userId } })
      if (vendor) {
        // Find all orders that contain this vendor's items and are not yet resolved
        const activeOrderItems = await tx.orderItem.findMany({
          where: { vendorId: vendor.id },
          select: { orderId: true },
          distinct: ['orderId'],
        })
        const activeOrderIds = activeOrderItems.map(r => r.orderId)

        if (activeOrderIds.length > 0) {
          // Block deletion if any order is already shipped — goods are in transit
          const shippedCount = await tx.order.count({
            where: { id: { in: activeOrderIds }, status: 'SHIPPED' }
          })
          if (shippedCount > 0) {
            throw Object.assign(new Error('SHIPPED_ORDERS'), { code: 'SHIPPED_ORDERS' })
          }

          // Auto-cancel PENDING and PAID orders — vendor can no longer fulfil them
          await tx.order.updateMany({
            where: { id: { in: activeOrderIds }, status: { in: ['PENDING', 'PAID'] } },
            data: { status: 'CANCELLED' }
          })
        }

        // Hard-delete products that were never ordered (safe to remove entirely)
        const orderedProductIds = await tx.orderItem.findMany({
          where: { vendorId: vendor.id },
          select: { productId: true },
          distinct: ['productId'],
        })
        const orderedIds = orderedProductIds.map(r => r.productId)

        await tx.productPic.deleteMany({
          where: { product: { vendorId: vendor.id, id: { notIn: orderedIds } } }
        })
        await tx.product.deleteMany({
          where: { vendorId: vendor.id, id: { notIn: orderedIds } }
        })

        // Archive products referenced by order history (cannot hard-delete — FK constraint)
        if (orderedIds.length > 0) {
          await tx.product.updateMany({
            where: { vendorId: vendor.id, id: { in: orderedIds } },
            data: { status: 'ARCHIVED' }
          })
        }

        // storeAddress and storePhone kept for post-deletion contact (disputes, refunds)
      }
    })

    return successResponse({ deleted: true })
  } catch (error) {
    console.error('Users DELETE error:', error)

    if (error.code === 'SHIPPED_ORDERS') {
      return errorResponse('Vous avez des commandes en cours de livraison. Veuillez attendre leur finalisation avant de supprimer votre compte.', 409)
    }
    if (error.code === 'P2025') {
      return errorResponse('User not found', 404)
    }

    return errorResponse('Failed to delete account', 500)
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401)
    }
    
    const userId = session.user.id

    const body = await request.json()
    const { firstName, lastName, phone, picture } = body
    
    // Check if at least one field is provided
    if (!firstName && !lastName && !phone && picture === undefined) {
      return errorResponse('At least one field must be provided for update')
    }

    // Build update data
    const updateData = {}
    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName
    if (phone !== undefined) updateData.phone = phone
    if (picture !== undefined) updateData.picture = picture

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        picture: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return successResponse(updatedUser)
  } catch (error) {
    console.error('Users PATCH error:', error)
    
    if (error.code === 'P2025') {
      return errorResponse('User not found', 404)
    }
    
    return errorResponse('Failed to update user', 500)
  }
}