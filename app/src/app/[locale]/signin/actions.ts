'use server'

import { signIn, signOut } from '@/auth'

export async function signInWithGoogle(callbackUrl: string) {
  await signIn('google', { redirectTo: callbackUrl })
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const callbackUrl = String(formData.get('callbackUrl') ?? '/')
  await signIn('resend', { email, redirectTo: callbackUrl })
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}
