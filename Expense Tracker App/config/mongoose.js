// ================= mongoose.js =================
// config/mongoose.js
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not defined in .env file.')
  process.exit(1)
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', () => console.log('❌ MongoDB connection error!'))
db.once('open', () => console.log('✅ MongoDB connected!'))

module.exports = db
