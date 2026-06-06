import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../src/utils/password';

describe('Password utilities', () => {
  it('should hash and verify password correctly', async () => {
    const password = 'TestPassword123!';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    const valid = await comparePassword(password, hash);
    expect(valid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const hash = await hashPassword('correct');
    const valid = await comparePassword('wrong', hash);
    expect(valid).toBe(false);
  });
});
