import { successResponse, errorResponse } from '@/lib/response'
import { requireFields } from '@/lib/validation'

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderId, amount, paymentMethod } = body
    
    // Validate required fields
    const missing = requireFields(body, ['orderId', 'amount', 'paymentMethod'])
    if (missing.length > 0) {
      return errorResponse(`Missing required fields: ${missing.join(', ')}`)
    }

    // Mock payment processing - always succeeds for demo
    const transactionId = `MOCK-${Date.now()}`
    
    const paymentResponse = {
      transactionId,
      status: 'PENDING',
      redirectUrl: null,
      message: 'Payment stub — CMI/PayZone integration pending'
    }

    return successResponse(paymentResponse, 201)
  } catch (error) {
    console.error('Payment initiate error:', error)
    return errorResponse('Failed to initiate payment', 500)
  }
}