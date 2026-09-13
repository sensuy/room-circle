import { OwnerRegistrationService } from './owners.js';
import { vi, test, expect } from 'vitest';
const input = { fullName: 'Test Owner', email: 'OWNER@example.com', phone: '+5511999999999', password: 'long-test-password' };
test('registration hashes passwords and attaches the referrer', async () => {
  const repo = { findReferrer: vi.fn().mockResolvedValue({ id: 'referrer' }), create: vi.fn().mockResolvedValue({ id: 'new-owner' }) };
  const result = await new OwnerRegistrationService(repo).register({ ...input, referralCode: 'code' });
  const saved = repo.create.mock.calls[0][0];
  expect(saved.email).toBe('owner@example.com');
  expect(saved.passwordHash).toMatch(/^scrypt:/);
  expect(saved.passwordHash).not.toContain(input.password);
  expect(saved.referredById).toBe('referrer');
  expect(result).toEqual({ id: 'new-owner', phoneVerified: false });
});
test('invalid referral never creates an account', async () => {
  const repo = { findReferrer: vi.fn().mockResolvedValue(null), create: vi.fn() };
  await expect(new OwnerRegistrationService(repo).register({ ...input, referralCode: 'invalid' })).rejects.toMatchObject({ status: 422 });
  expect(repo.create).not.toHaveBeenCalled();
});
test('duplicate registration returns conflict', async () => {
  const repo = { findReferrer: vi.fn(), create: vi.fn().mockRejectedValue({ code: 'P2002' }) };
  await expect(new OwnerRegistrationService(repo).register(input)).rejects.toMatchObject({ status: 409 });
});
