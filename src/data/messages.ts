import 'server-only';

import type { MessageStatus } from '@/generated/prisma/enums';
import { requireMembership } from '@/data/access';
import { prisma } from '@/lib/prisma';

export async function countUnreadOrganizationMessages(userId: string, organizationId: string) {
  await requireMembership(userId, organizationId);
  return prisma.message.count({ where: { status: 'NEW', channel: { target: { organizationId } } } });
}

export async function markUserMessageRead(userId: string, messageId: string) {
  const scope = { id: messageId, channel: { target: { organization: { memberships: { some: { userId } } } } } };
  const result = await prisma.message.updateMany({ where: { ...scope, status: 'NEW' }, data: { status: 'READ', readAt: new Date() } });
  if (result.count) return true;
  // Repeated opens are idempotent; inaccessible ids never report success.
  return Boolean(await prisma.message.findFirst({ where: scope, select: { id: true } }));
}

type ListOrganizationMessagesInput = {
  userId: string;
  organizationId: string;
  status?: MessageStatus;
  cursor?: string;
  limit?: number;
  offset?: number;
};

export async function listOrganizationMessages({
  userId,
  organizationId,
  status,
  cursor,
  limit = 30,
  offset = 0,
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
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : { skip: Math.max(0, Math.floor(offset)) }),
    select: {
      id: true,
      text: true,
      mood: true,
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

export async function getOrganizationMessagesPage(userId: string, organizationId: string, requestedPage: number) {
  await requireMembership(userId, organizationId);
  const total = await prisma.message.count({ where: { channel: { target: { organizationId } } } });
  const pageSize = 30;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pages, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1));
  const messages = await listOrganizationMessages({ userId, organizationId, limit: pageSize, offset: (page - 1) * pageSize });
  return { messages, page, pages, total };
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
      mood: true,
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
