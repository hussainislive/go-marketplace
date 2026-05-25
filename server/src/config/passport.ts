import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import bcrypt from 'bcryptjs'
import prisma from './database'
import { env } from './env'

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !user.password) {
        return done(null, false, { message: 'Invalid email or password' })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) return done(null, false, { message: 'Invalid email or password' })
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value
          if (!email) return done(new Error('No email from Google'))

          let user = await prisma.user.findUnique({ where: { googleId: profile.id } })
          if (!user) {
            user = await prisma.user.findUnique({ where: { email } })
            if (user) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId: profile.id, isVerified: true },
              })
            } else {
              user = await prisma.user.create({
                data: {
                  email,
                  name: profile.displayName,
                  googleId: profile.id,
                  avatar: profile.photos?.[0]?.value,
                  isVerified: true,
                },
              })
            }
          }
          return done(null, user)
        } catch (err) {
          return done(err as Error)
        }
      }
    )
  )
}

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: string }).id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport
