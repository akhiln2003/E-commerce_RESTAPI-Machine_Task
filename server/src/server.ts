import { app } from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'

try {
  await connectDatabase(env.MONGODB_URI)
  app.listen(env.PORT, () => console.log(`API listening on port ${env.PORT}`))
} catch (error) {
  console.error('Failed to start server', error)
  process.exit(1)
}
