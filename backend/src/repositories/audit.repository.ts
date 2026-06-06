import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';

export class AuditRepository {
  async create(data: {
    actorId: string;
    action: string;
    entity: string;
    entityId?: string;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string;
  }) {
    return prisma.auditLog.create({ data });
  }

  async findRecent(limit = 100) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { include: { profile: true } },
      },
    });
  }
}

export const auditRepository = new AuditRepository();
