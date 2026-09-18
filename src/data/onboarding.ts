import 'server-only';

import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import type { Locale } from '@/i18n/routing';
import type { OnboardingSummary } from '@/lib/onboarding-schema';

const selection = {
  id: true,
  name: true,
  targets: {
    where: { isActive: true },
    orderBy: { createdAt: 'asc' as const },
    take: 1,
    select: {
      publicName: true,
      channels: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' as const },
        take: 1,
        select: { publicId: true },
      },
    },
  },
} as const;

type OrganizationSelection = {
  id: string;
  name: string;
  targets: { publicName: string; channels: { publicId: string }[] }[];
};

function toSummary(organization: OrganizationSelection): OnboardingSummary | null {
  const target = organization.targets[0];
  const channel = target?.channels[0];
  return channel ? { organizationId: organization.id, name: target.publicName, publicId: channel.publicId } : null;
}

export async function getUserOnboarding(userId: string) {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: { organization: { select: selection } },
  });
  return {
    hasOrganization: Boolean(membership),
    summary: membership ? toSummary(membership.organization) : null,
  };
}

export class IncompleteOrganizationError extends Error {}

export async function createFirstOrganization(userId: string, name: string, locale: Locale): Promise<OnboardingSummary> {
  return prisma.$transaction(async (tx) => {
    // A database row lock serializes onboarding for this user across tabs/instances.
    const users = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM users WHERE id = ${userId} FOR UPDATE`;
    if (!users.length) throw new Error('User not found');
    const existing = await tx.membership.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { organization: { select: selection } },
    });
    if (existing) {
      const summary = toSummary(existing.organization);
      if (!summary) throw new IncompleteOrganizationError();
      return summary;
    }

    const organization = await tx.organization.create({
      data: {
        name,
        slug: randomUUID(),
        memberships: { create: { userId, role: 'OWNER' } },
        settings: { create: { defaultLocale: locale, enabledLocales: ['ru', 'en'] } },
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
        targets: {
          create: {
            name,
            publicName: name,
            slug: 'main',
            defaultLocale: locale,
            enabledLocales: ['ru', 'en'],
            channels: { create: { name, publicId: randomUUID() } },
          },
        },
      },
      select: selection,
    });
    const summary = toSummary(organization);
    if (!summary) throw new Error('Channel not created');
    return summary;
  }, { timeout: 15000 });
}
