import { query as q } from 'faunadb'

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna'

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user'
    }),
  ],
  jwt: {
    signinKey: process.env.SIGNIN_KEY,
  },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      const { email } = user

      try {
        await fauna.query(
          q.Create(
            q.Collection('users'),
            { data: { email }}
          )
        )
        return true
      } catch {
        return false
      }

      return true
    },
  }
}
export default NextAuth(authOptions)