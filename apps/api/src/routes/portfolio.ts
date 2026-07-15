import type { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function portfolioRoutes(app: FastifyInstance) {
  // GET /api/portfolio/:username — public, powers the portfolio page
  app.get<{ Params: { username: string } }>('/:username', async (req, reply) => {
    const { username } = req.params;

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        user: { username },
        publishedAt: { not: null },
      },
      include: { projects: { orderBy: { order: 'asc' } } },
    });

    if (!portfolio) return reply.status(404).send({ error: 'Portfolio not found' });
    return reply.send({ portfolio });
  });

  // POST /api/portfolio — create portfolio for a user
  app.post<{ Body: { githubId: string; username: string; name: string; avatarUrl: string; email: string } }>(
    '/',
    async (req, reply) => {
      const { githubId, username, name, avatarUrl, email } = req.body;

      // Upsert user
      const user = await prisma.user.upsert({
        where: { githubId },
        update: { username, name, avatarUrl, email },
        create: { githubId, username, name, avatarUrl, email },
      });

      // Create portfolio if it doesn't exist
      const portfolio = await prisma.portfolio.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
      });

      return reply.send({ user, portfolio });
    }
  );

  // POST /api/portfolio/publish
  app.post<{ Body: { portfolioId: string } }>('/publish', async (req, reply) => {
    const { portfolioId } = req.body;

    const portfolio = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { publishedAt: new Date() },
    });

    return reply.send({ portfolio });
  });
}