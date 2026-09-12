import 'server-only';

import { requireMembership } from '@/data/access';
import { prisma } from '@/lib/prisma';

const organizationSummary = {
  id: true,
  name: true,
  slug: true,
  createdAt: true,
} as const;

export async function listUserOrganizations(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    orderBy: { organization: { name: 'asc' } },
    select: {
      role: true,
      organization: { select: organizationSummary },
    },
  });

  return memberships.map(({ organization, role }) => ({
    ...organization,
    role,
  }));
}

export async function getOrganization(
  userId: string,
  organizationId: string,
) {
  await requireMembership(userId, organizationId);

  return prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      ...organizationSummary,
      settings: {
        select: {
          emailNotifications: true,
          notificationEmail: true,
          defaultLocale: true,
          enabledLocales: true,
        },
      },
      subscription: {
        select: {
          plan: true,
          status: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
        },
      },
    },
  });
}
