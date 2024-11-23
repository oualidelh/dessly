// import { redirect } from 'next/navigation'

import { createClient } from "../../../utils/supabase/server"

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    console.log("error private", error)
    // redirect('/sign-in')
  }

  return <p>Hello {data.user?.email}</p>
}