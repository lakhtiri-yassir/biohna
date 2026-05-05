// auth.js
// Single NextAuth initialization point. Exports handlers, auth, signIn, signOut.

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { settings: true }
          })

          if (!user) return null

          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            picture: user.picture,
            settings: user.settings
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ]
})