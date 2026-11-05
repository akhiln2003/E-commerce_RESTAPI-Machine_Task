import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'
import { authRouter } from './routes/auth.routes.js'

export const app = express()
app.use(helmet())
app.use(cors({ origin: env.CLIENT_ORIGIN }))
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }))
app.use(errorHandler)
