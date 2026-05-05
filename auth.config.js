// auth.config.js
// NextAuth configuration — credentials, callbacks, pages only.
// NextAuth() is called in auth.js, NOT here.

export const authConfig = {
  providers: [], // providers are added in auth.js
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.fullName = user.fullName
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
        session.user.picture = token.picture
        session.user.settings = token.settings
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}