"use client"

import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import { auth } from "@/lib/firebase"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"


const ADMIN_EMAILS = ["admin@admin.com"] 

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async (email: string, password: string, name?: string) => {},
  isAdmin: false,
})

export const useAuth = () => useContext(AuthContext)

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
     
        const isEmailAdmin = user.email ? ADMIN_EMAILS.includes(user.email) : false


        user.getIdTokenResult().then((idTokenResult) => {
      
          setIsAdmin(isEmailAdmin || idTokenResult.claims?.admin === true)
        })
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      if (name && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        })

        await userCredential.user.reload()
      }
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    signUp,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

