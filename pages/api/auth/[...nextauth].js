import NextAuth, { Awaitable, RequestInternal, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'TEAMDAO Account',
            async authorize(credentials, req) {
                let result = null
                const { username, password } = credentials
                if (username === process.env.PSI_USERNAME && password === process.env.PSI_PASSWORD) {
                    result = { id: 'admin', name: 'admin', image: '/assets/user/admin.png' }
                }
                return result
            }
        })
    ],
    secret: process.env.SECRET,
    callbacks: {
        async session({ session, user, token }) {
            if (session) {
                session.user.id = token.sub
            }
            return session
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 15 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60
    },
    pages: {
        signIn: '/auth'
    }
})