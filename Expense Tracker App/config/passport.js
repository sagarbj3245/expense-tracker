// ================= passport.js =================
// config/passport.js
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (!user || !bcrypt.compareSync(password, user.password)) {
            req.session.email = req.body.email
            req.session.password = req.body.password
            return done(null, false, { message: 'Incorrect Email or Password' })
          }
          return done(null, user)
        } catch (err) {
          return done(err, false)
        }
      }
    )
  )

  if (process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET && process.env.FACEBOOK_CALLBACK) {
    passport.use(
      new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['id', 'email', 'displayName', 'picture.type(large)']
      }, async (accessToken, refreshToken, profile, done) => {
        const { email, name, id, picture } = profile._json
        try {
          let user = await User.findOne({ $or: [{ email }, { facebookId: id }] })
          if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8)
            user = await User.create({
              name,
              email,
              password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10), null),
              facebookId: id,
              avatar: picture.data.url || `https://robohash.org/${name}`
            })
          }
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      })
    )
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK) {
    passport.use(
      new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
      }, async (token, tokenSecret, profile, done) => {
        const { sub, name, email, picture } = profile._json
        try {
          let user = await User.findOne({ $or: [{ email }, { googleId: sub }] })
          if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8)
            user = await User.create({
              name,
              email,
              avatar: picture || `https://robohash.org/${name}`,
              password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10), null),
              googleId: sub
            })
          }
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      })
    )
  }

  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    User.findById(id).lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}