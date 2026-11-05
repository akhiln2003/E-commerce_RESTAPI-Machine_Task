import bcrypt from 'bcryptjs'
import type { RequestHandler } from 'express'
import { z } from 'zod'
import { UserModel } from '../models/user.model.js'
import { signToken } from '../utils/jwt.js'

const credentialsSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
})

export const register: RequestHandler = async (req, res) => {
  const input = credentialsSchema.extend({ name: z.string().trim().min(2).max(100) }).parse(req.body)
  const existingUser = await UserModel.exists({ email: input.email.toLowerCase() })
  if (existingUser) {
    res.status(409).json({ message: 'Email is already registered' })
    return
  }
  const password = await bcrypt.hash(input.password, 12)
  const user = await UserModel.create({ ...input, email: input.email.toLowerCase(), password })
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token: signToken(user.id) })
}

export const login: RequestHandler = async (req, res) => {
  const input = credentialsSchema.omit({ name: true }).parse(req.body)
  const user = await UserModel.findOne({ email: input.email.toLowerCase() }).select('+password')
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token: signToken(user.id) })
}

export const me: RequestHandler = async (req, res) => {
  const user = await UserModel.findById(req.userId).select('-password')
  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  res.json({ user: { id: user.id, name: user.name, email: user.email } })
}
