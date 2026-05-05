import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/response'
import { auth } from '@/auth'

export async function GET(request) {
  try {
    const session = await auth()
    
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

export async function PATCH(request) {
  try {
    const session = await auth()
    
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