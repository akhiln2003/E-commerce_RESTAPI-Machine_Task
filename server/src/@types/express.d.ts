declare global {
  namespace Express {
    interface Request {
      userId?: string
      emailId?: string
      userRole?: "user" | "admin"
    }
  }
}

export {}
