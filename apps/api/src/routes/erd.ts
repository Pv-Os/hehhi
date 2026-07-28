import type { FastifyInstance } from 'fastify';
import { sqlToERD } from '../services/erd';

export async function erdRoutes(app: FastifyInstance) {
  // POST /api/erd/parse
  // Accepts raw SQL and returns Mermaid ERD + table metadata
  app.post<{
    Body: { sql: string };
  }>('/parse', async (req, reply) => {
    const { sql } = req.body;

    if (!sql?.trim()) {
      return reply.status(400).send({ error: 'SQL schema is required' });
    }

    try {
      const result = sqlToERD(sql);

      if (result.tableCount === 0) {
        return reply.status(400).send({
          error: 'No tables found. Make sure your SQL contains CREATE TABLE statements.',
        });
      }

      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({
        error: 'Failed to parse SQL schema',
        detail: err.message,
      });
    }
  });

  // POST /api/erd/from-github
  // Fetches a .sql file from a GitHub URL and parses it
  app.post<{
    Body: { fileUrl: string; accessToken?: string };
  }>('/from-github', async (req, reply) => {
    const { fileUrl, accessToken } = req.body;

    // Convert github.com URL to raw content URL
    const rawUrl = fileUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');

    try {
      const res = await fetch(rawUrl, {
        headers: accessToken ? { Authorization: `token ${accessToken}` } : {},
      });

      if (!res.ok) {
        return reply.status(404).send({ error: 'Could not fetch SQL file from GitHub' });
      }

      const sql = await res.text();
      const result = sqlToERD(sql);

      return reply.send(result);
    } catch (err: any) {
      return reply.status(502).send({
        error: 'Failed to fetch or parse schema',
        detail: err.message,
      });
    }
  });
}
