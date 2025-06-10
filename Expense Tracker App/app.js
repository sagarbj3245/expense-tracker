// ================= app.js =================
// app.js
const express = require('express')
const session = require('express-session')
const redis = require('redis')
const connectRedis = require('connect-redis')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
const usePassport = require('./config/passport')
require('./config/mongoose')
require('./utils/handlebars-helper')

const PORT = process.env.PORT || 3000
const app = express()

// Set up template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// Redis client
const RedisStore = connectRedis(session)
const redisClient = redis.createClient({
  legacyMode: true // for compatibility
})
redisClient.connect().catch(console.error)

redisClient.on('connect', () => console.log('✅ Redis connected!'))
redisClient.on('error', err => console.error('❌ Redis error:', err))

// Session config
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      secure: false,
      httpOnly: false
    }
  })
)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use(express.static('public'))

// Method override
app.use(methodOverride('_method'))

// Initialize Passport
usePassport(app)

// Flash messages
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

// Routes
app.use(routes)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`)
})
