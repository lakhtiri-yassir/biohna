import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './lib/prisma.js'

export const authConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { settings: true }
          })

          if (!user) {
            return null
          }

          // Compare password
          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          // Transform user object to match AuthContext expectations
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            phone: user.phone,
            picture: user.picture,
            settings: user.settings || {
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
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.fullName = user.fullName
        token.phone = user.phone
        token.picture = user.picture
        token.settings = user.settings
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
        session.user.fullName = token.fullName
        session.user.phone = token.phone
        session.user.picture = token.picture
        session.user.settings = token.settings
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/signin'
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)