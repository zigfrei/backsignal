import 'server-only';

import { requireMembership } from '@/data/access';
import { prisma } from '@/lib/prisma';

export async function listFeedbackTargets(
  userId: string,
  organizationId: string,
) {
  await requireMembership(userId, organizationId);

  return prisma.feedbackTarget.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      publicName: true,
      defaultLocale: true,
      enabledLocales: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: { channels: true },
      },
    },
  });
}

export async function getFeedbackTarget(
  userId: string,
  organizationId: string,
  targetId: string,
) {
  await requireMembership(userId, organizationId);

  return prisma.feedbackTarget.findFirst({
    where: { id: targetId, organizationId },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      publicName: true,
      welcomeMessage: true,
      defaultLocale: true,
      enabledLocales: true,
      isActive: true,
      channels: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          publicId: true,
          name: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
  });
}
