import { z } from 'zod';

export const onboardingSchema = z.object({
  name: z.string().trim().min(2).max(100).refine((value) => !/[\u0000-\u001f\u007f]/.test(value)),
});

export interface OnboardingSummary {
  organizationId: string;
  name: string;
  publicId: string;
}
