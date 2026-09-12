import 'server-only';

import { cache } from 'react';

import type { MembershipRole } from '@/generated/prisma/enums';
import { prisma } from '@/lib/prisma';

export class AccessDeniedError extends Error {
  constructor() {
    super('Access denied');
    this.name = 'AccessDeniedError';
  }
}

const getMembership = cache(async (userId: string, organizationId: string) => {
  return prisma.membership.findUnique({
    where: {
      userId_organizationId: { userId, organizationId },
    },
    select: {
      id: true,
      role: true,
      userId: true,
      organizationId: true,
    },
  });
});

export async function requireMembership(
  userId: string,
  organizationId: string,
) {
  const membership = await getMembership(userId, organizationId);

  if (!membership) {
    throw new AccessDeniedError();
  }

  return membership;
}

export async function requireOrganizationRole(
  userId: string,
  organizationId: string,
  allowedRoles: readonly MembershipRole[],
) {
  const membership = await requireMembership(userId, organizationId);

  if (!allowedRoles.includes(membership.role)) {
    throw new AccessDeniedError();
  }

  return membership;
}
