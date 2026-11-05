import type { RequestHandler } from 'express'
import { verifyToken } from '../utils/jwt.js'

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header('authorization')
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' })
    return
  }
  try {
    const { userId } = verifyToken(header.slice(7))
    req.userId = userId
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
