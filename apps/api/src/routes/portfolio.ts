import type { FastifyInstance } from 'fastify';

export async function portfolioRoutes(app: FastifyInstance) {
  app.get('/:username', async (_req, reply) => reply.send({ portfolio: null }));
  app.put('/', async (_req, reply) => reply.send({ ok: true }));
  app.post('/publish', async (_req, reply) => reply.send({ published: true }));
}
