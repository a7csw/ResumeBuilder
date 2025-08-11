import { bypassPayments } from '@/lib/env';

export const paymentsDisabled = () => {
  // In test mode, all payment checks are bypassed
  return bypassPayments();
};