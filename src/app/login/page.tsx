"use client"

import { signIn, signOut, useSession } from "next-auth/react"

export default function LoginButton() {
  const { data: session } = useSession()
  console.log("moduleLinks", session?.moduleLinks)
  if (session) {
    return (
      <>
        <p>{session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return (
    <button onClick={() => signIn("azure-ad")}>
      Sign in with Microsoft
    </button>
  )
}