import { useState } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'

type Registration = { fullName: string; email: string; phone: string; password: string; referralCode: string }
export default function App() {
  const [message, setMessage] = useState('')
  const [created, setCreated] = useState(false)
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Registration>({
    defaultValues: { referralCode: new URLSearchParams(window.location.search).get('ref') ?? '' },
  })
  async function submit(values: Registration) {
    setMessage('')
    try {
      const response = await fetch('/api/owners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      if (response.status === 201) { setCreated(true); return }
      setMessage(response.status === 409 ? 'An account already exists with these details.' : response.status === 422 ? 'Invalid referral code. Correct it or continue without a code.' : 'Your account could not be created. Check your details and try again.')
    } catch { setMessage('Unable to reach the server. Please try again.') }
  }
  return <main className="registration">
    <p className="brand">RoomCircle</p>
    {created ? <><h1>Your account is created</h1><p>Your phone still needs verification before you can publish a room.</p></> : <>
      <h1>Create your owner account</h1><p>Start with your details. Add your property and rooms next.</p>
      <form onSubmit={handleSubmit(submit)}>
        <label>Full name<input autoComplete="name" required minLength={2} maxLength={120} {...register('fullName')} /></label>
        <label>Email<input type="email" autoComplete="email" required maxLength={254} {...register('email')} /></label>
        <label>Phone number<input type="tel" autoComplete="tel" required pattern="\+[1-9][0-9]{7,14}" placeholder="+5511999999999" {...register('phone')} /></label>
        <label>Password<input type="password" autoComplete="new-password" required minLength={12} maxLength={128} {...register('password')} /></label>
        <p>Use at least 12 characters for your password.</p>
        <label>Referral code (optional)<input maxLength={64} {...register('referralCode')} /></label>
        {message && <p role="alert">{message}</p>}
        <button disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'}</button>
      </form>
    </>}
  </main>
}
