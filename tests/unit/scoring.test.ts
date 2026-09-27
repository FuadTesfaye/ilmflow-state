import { describe, expect, it } from 'bun:test';
import { calculatePricing } from '../../src/features/registrations/server/registrationService';
import { hasPermission } from '../../src/lib/permissions/rbac';

describe('Domain Logic: Pricing & Discounts', () => {
  it('calculates free tier with zero charge', async () => {
    const res = await calculatePricing(0, 1);
    expect(res.finalAmount).toBe(0);
    expect(res.discountAmount).toBe(0);
  });

  it('calculates standard pricing without discounts', async () => {
    const res = await calculatePricing(45, 1);
    expect(res.baseAmount).toBe(45);
    expect(res.finalAmount).toBe(45);
  });
});

describe('Domain Logic: RBAC Permissions', () => {
  it('allows superadmin all permissions', () => {
    expect(hasPermission('superadmin', 'event:create')).toBe(true);
    expect(hasPermission('superadmin', 'submission:grade')).toBe(true);
    expect(hasPermission('superadmin', 'user:suspend')).toBe(true);
  });

  it('restricts judge to grading only', () => {
    expect(hasPermission('judge', 'submission:grade')).toBe(true);
    expect(hasPermission('judge', 'event:create')).toBe(false);
    expect(hasPermission('judge', 'user:suspend')).toBe(false);
  });

  it('restricts staff to check-in scanning only', () => {
    expect(hasPermission('staff', 'attendance:scan')).toBe(true);
    expect(hasPermission('staff', 'submission:grade')).toBe(false);
    expect(hasPermission('staff', 'competition:create')).toBe(false);
  });
});
