import 'server-only';

import type { MessageStatus } from '@/generated/prisma/enums';
import { requireMembership } from '@/data/access';
import { prisma } from '@/lib/prisma';

type ListOrganizationMessagesInput = {
  userId: string;
  organizationId: string;
  status?: MessageStatus;
  cursor?: string;
  limit?: number;
};

export async function listOrganizationMessages({
  userId,
  organizationId,
  status,
  cursor,
  limit = 30,
}: ListOrganizationMessagesInput) {
  await requireMembership(userId, organizationId);

  const take = Math.min(Math.max(limit, 1), 100);

  return prisma.message.findMany({
    where: {
      status,
      channel: {
        target: { organizationId },
      },
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      text: true,
      locale: true,
      status: true,
      readAt: true,
      archivedAt: true,
      createdAt: true,
      channel: {
        select: {
          id: true,
          name: true,
          target: {
            select: {
              id: true,
              name: true,
              publicName: true,
            },
          },
        },
      },
    },
  });
}

export async function getOrganizationMessage(
  userId: string,
  organizationId: string,
  messageId: string,
) {
  await requireMembership(userId, organizationId);

  return prisma.message.findFirst({
    where: {
      id: messageId,
      channel: { target: { organizationId } },
    },
    select: {
      id: true,
      text: true,
      locale: true,
      status: true,
      readAt: true,
      archivedAt: true,
      createdAt: true,
      channel: {
        select: {
          id: true,
          name: true,
          target: {
            select: {
              id: true,
              name: true,
              publicName: true,
            },
          },
        },
      },
    },
  });
}
