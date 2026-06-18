import type { FastifyInstance } from 'fastify';

export async function terminalRoutes(app: FastifyInstance) {
  app.post<{ Body: { projectId: string; repoUrl: string } }>('/start', async (_req, reply) => {
    try {
      return reply.send({
        sandboxId: 'placeholder-sandbox-id',
        wsUrl: 'wss://sandbox.e2b.dev/placeholder',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });
    } catch (err: any) {
      return reply.status(502).send({ error: 'Failed to start sandbox', detail: err.message });
    }
  });

  app.delete('/:sandboxId', async (_req, reply) => {
    return reply.send({ terminated: true });
  });
}
