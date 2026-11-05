import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'

export type JwtPayload = { userId: string }

export function signToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] })
}

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, env.JWT_SECRET)
  if (typeof payload !== 'object' || typeof payload.userId !== 'string') {
    throw new Error('Invalid token payload')
  }
  return { userId: payload.userId }
}
