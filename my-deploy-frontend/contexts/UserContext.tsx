"use client";
// contexts/UserContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import axios from 'axios'
import { getCookie } from '../utils/cookies'

interface User {
  userId: string
  name:string
  email: string
  role: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = getCookie('jwt') // <- Get token from cookies
   
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL_USER +"/auth/profile", {
        method: "GET",
        credentials: "include", // Required to send cookies
      });
    
      if (!res.ok) {
        throw new Error("Unauthorized");
      }
    
      const data = await res.json();
      setUser(data);
      console.log("user:", data);
    } catch (err) {
      setUser(null);
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
