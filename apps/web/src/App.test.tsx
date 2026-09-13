// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
afterEach(() => { cleanup(); vi.unstubAllGlobals(); window.history.replaceState({}, '', '/') })
test('referral link fills the optional code', () => {
  window.history.replaceState({}, '', '/?ref=OWNER123')
  render(<App />)
  expect((screen.getByLabelText('Referral code (optional)') as HTMLInputElement).value).toBe('OWNER123')
})
test('failed registration preserves details and displays an error', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 422 }))
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText('Full name'), 'Test Owner')
  await user.type(screen.getByLabelText('Email'), 'owner@example.com')
  await user.type(screen.getByLabelText('Phone number'), '+5511999999999')
  await user.type(screen.getByLabelText('Password'), 'long-test-password')
  await user.click(screen.getByRole('button', { name: 'Create account' }))
  expect((await screen.findByRole('alert')).textContent).toContain('Invalid referral code')
  expect((screen.getByLabelText('Email') as HTMLInputElement).value).toBe('owner@example.com')
})
