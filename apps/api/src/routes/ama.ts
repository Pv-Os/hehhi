import type { FastifyInstance } from 'fastify';
import { askAMA } from '../services/ama';

export async function amaRoutes(app: FastifyInstance) {
  app.post<{
    Params: { username: string };
    Body: { question: string; visitorId: string };
  }>('/:username/ask', async (req, reply) => {
    const { username } = req.params;
    const { question, visitorId } = req.body;
    if (!question?.trim()) return reply.status(400).send({ error: 'Question is required' });

    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');

    try {
      await askAMA({ username, question, visitorId, stream: reply.raw });
    } catch {
      reply.raw.write(`data: ${JSON.stringify({ error: 'Failed to generate answer' })}\n\n`);
    } finally {
      reply.raw.end();
    }
  });

  app.get('/:portfolioId/questions', async (_req, reply) => {
    return reply.send({ questions: [] });
  });
}
