const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const UserModel = require("../Author/AuthorsSchema")
const { authenticate } = require("./tools")

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/authors/googleRedirect",
    },
    async (request, accessToken, refreshToken, profile, next) => {
      const newUser = {
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        role: "User",
        refreshTokens: [],
      }

      try {
        const user = await UserModel.findOne({ googleId: profile.id })

        if (user) {
          const tokens = await authenticate(user)
          next(null, { user, tokens })
        } else {
          const createdUser = new UserModel(newUser)
          await createdUser.save()
          const tokens = await authenticate(createdUser)
          done(null, { user: createdUser, tokens })
          console.log('authing:::..tokens:::', tokens, 'createduser: ', createdUser)
        }
      } catch (error) {
        console.log('oauth passport', error)
        next(error)
      }
    }
  )
)

passport.serializeUser(function (user, next) {
  next(null, user)
})
