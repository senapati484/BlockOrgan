"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { auth, googleProvider } from "@/lib/auth"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
} from "firebase/auth"

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signInWithEmail(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password)
      },
      async signUpWithEmail(name: string, email: string, password: string) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name) {
          await updateProfile(cred.user, { displayName: name })
        }
      },
      async signInWithGoogle() {
        await signInWithPopup(auth, googleProvider)
      },
      async signOut() {
        await fbSignOut(auth)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
