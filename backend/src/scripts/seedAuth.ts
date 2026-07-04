import { env } from '../config/env.js'
import { supabase } from '../config/supabase.js'

const demoUser = {
  fullName: 'Diptish Gohane',
  email: 'diptishgohane04@gmail.com',
  password: 'Dipking@04',
  phone: '+918261950281',
}

async function seedAuth() {
  if (!supabase || !env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env')
  }

  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) throw listError

  const existing = existingUsers.users.find((user) => user.email?.toLowerCase() === demoUser.email)
  const authResult = existing
    ? await supabase.auth.admin.updateUserById(existing.id, {
        password: demoUser.password,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: { full_name: demoUser.fullName, phone: demoUser.phone },
      })
    : await supabase.auth.admin.createUser({
        email: demoUser.email,
        password: demoUser.password,
        email_confirm: true,
        phone: demoUser.phone,
        phone_confirm: true,
        user_metadata: { full_name: demoUser.fullName, phone: demoUser.phone },
      })

  if (authResult.error) throw authResult.error
  const user = authResult.data.user
  if (!user) throw new Error('Supabase did not return a user')

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: demoUser.fullName,
    credit_score: 760,
    updated_at: new Date().toISOString(),
  })
  if (profileError) throw profileError

  console.log('Auth seed complete')
  console.log(`Email: ${demoUser.email}`)
  console.log(`Password: ${demoUser.password}`)
}

seedAuth().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
