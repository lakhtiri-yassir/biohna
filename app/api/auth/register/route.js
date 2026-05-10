import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma.js'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, fullName, role = 'CLIENT', storeName, storeAddress } = body

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (role === 'VENDOR' && !storeName) {
      return NextResponse.json(
        { success: false, error: 'Store name is required for vendor accounts' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findFirst({ where: { email, deletedAt: null } })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Check if a soft-deleted account exists with this email — reuse its row
    const deletedUser = await prisma.user.findFirst({ where: { email, deletedAt: { not: null } } })

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await prisma.$transaction(async (tx) => {
      let user

      if (deletedUser) {
        // Restore the soft-deleted row so we don't violate the unique email constraint
        user = await tx.user.update({
          where: { id: deletedUser.id },
          data: {
            passwordHash: hashedPassword,
            firstName,
            lastName,
            role,
            deletedAt: null,
          }
        })

        // Reset or create settings
        await tx.userSettings.upsert({
          where: { userId: user.id },
          create: { userId: user.id, language: 'fr', currency: 'MAD', notificationsEnabled: true },
          update: { language: 'fr', currency: 'MAD', notificationsEnabled: true },
        })
      } else {
        user = await tx.user.create({
          data: {
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            role,
          }
        })

        await tx.userSettings.create({
          data: {
            userId: user.id,
            language: 'fr',
            currency: 'MAD',
            notificationsEnabled: true
          }
        })
      }

      let vendor = null
      if (role === 'VENDOR') {
        vendor = await tx.vendor.upsert({
          where: { userId: user.id },
          create: { userId: user.id, storeName, storeAddress: storeAddress || null },
          update: { storeName, storeAddress: storeAddress || null },
        })
      }

      return { user, vendor }
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role,
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
