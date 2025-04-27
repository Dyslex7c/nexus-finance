import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { User } from "./models/user"
import { connectToDatabase } from "./mongodb"

export interface AuthUser {
  id: string
  name?: string
  email: string
  image?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET || "fallback_secret_do_not_use_in_production") as {
      id: string
      email: string
    }

    // Connect to database
    await connectToDatabase()

    // Find user
    const user = await User.findById(decoded.id)
    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      email: user.email,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}

