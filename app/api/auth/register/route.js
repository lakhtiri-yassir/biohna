import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, fullName, role = 'CLIENT' } = body

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and settings in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          role: role.toUpperCase()
        }
      })

      const settings = await tx.userSettings.create({
        data: {
          userId: user.id,
          language: 'fr',
          currency: 'MAD',
          notifications: {
            email: true,
            push: false,
            marketing: false
          },
          privacy: {
            profilePublic: false,
            showEmail: false,
            showPhone: false
          }
        }
      })

      return { user, settings }
    })

    // Return success (don't include password in response)
    const { password: _, ...userWithoutPassword } = result.user
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          settings: result.settings
        }
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}