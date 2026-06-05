import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import hpp from 'hpp'
import './config/env'
import './config/passport'
import passport from 'passport'
import { generalLimiter } from './middleware/rateLimiter'
import { errorHandler } from './middleware/errorHandler'
import { ApiError } from './utils/ApiError'

import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import adRoutes from './routes/ad.routes'
import categoryRoutes from './routes/category.routes'
import conversationRoutes from './routes/conversation.routes'
import notificationRoutes from './routes/notification.routes'
import reportRoutes from './routes/report.routes'
import adminRoutes from './routes/admin.routes'
import contactRoutes from './routes/contact.routes'

const app = express()

app.set('trust proxy', 1)

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'res.cloudinary.com', 'images.unsplash.com'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
)

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.use(hpp())
app.use(generalLimiter)
app.use(passport.initialize())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/ads', adRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/conversations', conversationRoutes)
app.use('/api/v1/notifications', notificationRoutes)
app.use('/api/v1/reports', reportRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/contact', contactRoutes)

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, message: 'GO Marketplace API is running' })
})

app.use((_req, _res, next) => {
  next(ApiError.notFound('Route not found'))
})

app.use(errorHandler)

export default app
