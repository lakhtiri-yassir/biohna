import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { requireFields } from '@/lib/validation'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, paymentMethod, cart, shipping } = body
    
    // Validate required fields
    const missing = requireFields(body, ['userId', 'paymentMethod', 'cart', 'shipping'])
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Validate cart
    if (!Array.isArray(cart) || cart.length === 0) {
      return errorResponse('Cart must be a non-empty array')
    }

    // Validate cart items
    for (const item of cart) {
      const itemMissing = requireFields(item, ['productId', 'quantity', 'pricePerUnit', 'vendorId'])
      if (itemMissing.length > 0) {
        return errorResponse(`Cart item missing fields: ${itemMissing.join(', ')}`)
      }
    }

    // Validate shipping
    const shippingMissing = requireFields(shipping, ['recipientName', 'addressLine1', 'city'])
    if (shippingMissing.length > 0) {
      return errorResponse(`Shipping missing fields: ${shippingMissing.join(', ')}`)
    }

    // Calculate total amount server-side
    const totalAmount = cart.reduce((sum, item) => {
      return sum + (item.quantity * item.pricePerUnit)
    }, 0)

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          paymentMethod,
          totalAmount,
          status: 'PENDING'
        }
      })

      // Create order items
      await tx.orderItem.createMany({
        data: cart.map(item => ({
          orderId: newOrder.id,
          productId: item.productId,
          vendorId: item.vendorId,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit,
          subtotal: item.quantity * item.pricePerUnit
        }))
      })

      // Create shipping info
      await tx.shippingInfo.create({
        data: {
          orderId: newOrder.id,
          recipientName: shipping.recipientName,
          addressLine1: shipping.addressLine1,
          addressLine2: shipping.addressLine2,
          city: shipping.city,
          postalCode: shipping.postalCode,
          phone: shipping.phone,
          shippingMethod: shipping.shippingMethod || 'STANDARD'
        }
      })

      // Return order with related data
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              product: {
                select: { name: true }
              },
              vendor: {
                select: { storeName: true }
              }
            }
          },
          shipping: true
        }
      })
    })

    return successResponse(order, 201)
  } catch (error) {
    console.error('Orders POST error:', error)
    
    if (error.code === 'P2003') {
      return errorResponse('Invalid user, product, or vendor ID', 400)
    }
    
    return errorResponse('Failed to create order', 500)
  }
}