import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import { app } from "./firebase"

export const db = getFirestore(app)

export type DonorProfile = Record<string, any>
export type RecipientProfile = Record<string, any>

export async function saveDonorProfile(uid: string, data: DonorProfile) {
  const ref = doc(db, "donors", uid)
  await setDoc(ref, { ...data, updatedAt: Date.now() }, { merge: true })
}

export async function saveRecipientProfile(uid: string, data: RecipientProfile) {
  const ref = doc(db, "recipients", uid)
  await setDoc(ref, { ...data, updatedAt: Date.now() }, { merge: true })
}

export async function getDonorProfile(uid: string) {
  const ref = doc(db, "donors", uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function getRecipientProfile(uid: string) {
  const ref = doc(db, "recipients", uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}
