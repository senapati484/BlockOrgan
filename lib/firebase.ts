import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore"
// IMPORTANT: Do not import analytics at module scope in Next.js (SSR). Guard it on the client.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} as const

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

// Enable offline persistence in the browser
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err: any) => {
    if (err?.code === 'failed-precondition') {
      console.warn('Firestore persistence failed-precondition (multiple tabs)')
    } else if (err?.code === 'unimplemented') {
      console.warn('Firestore persistence not supported in this browser')
    }
  })
}

// Optionally use emulator (client and server) when the flag is set
if (process.env.NEXT_PUBLIC_USE_FIRESTORE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    console.log('Using Firestore emulator on localhost:8080')
  } catch (error) {
    console.log('Firestore emulator not connected', error)
  }
}

// Lazy init analytics only in the browser and only if supported
let analytics: unknown = undefined
if (typeof window !== "undefined") {
  // Dynamically import to avoid including in SSR bundle
  import("firebase/analytics").then(async ({ getAnalytics, isSupported }) => {
    try {
      if (await isSupported()) {
        analytics = getAnalytics(app)
      }
    } catch {
      // noop – analytics optional
    }
  })
}

export { app, db, analytics }
