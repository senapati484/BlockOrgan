import { initializeApp, getApps, getApp } from "firebase/app"
// IMPORTANT: Do not import analytics at module scope in Next.js (SSR). Guard it on the client.

const firebaseConfig = {
  apiKey: "AIzaSyB-tKtjQtc2DuOSDTHWODzTo9Yz4PLT2GU",
  authDomain: "blockorgan-1a69a.firebaseapp.com",
  projectId: "blockorgan-1a69a",
  storageBucket: "blockorgan-1a69a.firebasestorage.app",
  messagingSenderId: "129200691369",
  appId: "1:129200691369:web:008a796a76871e88ea31b8",
  measurementId: "G-50PZQ4DTFJ",
} as const

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

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

export { app, analytics }
