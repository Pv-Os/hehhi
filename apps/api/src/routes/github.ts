import type { FastifyInstance } from 'fastify';
import { Octokit } from 'octokit';
import { PrismaClient } from '@prisma/client';
import type { RepoMetadata } from '@hehhi/types';

const prisma = new PrismaClient();

export async function githubRoutes(app: FastifyInstance) {
  // POST /api/github/import
  // Fetches repo from GitHub and saves it as a Project in the DB
  app.post<{ Body: { repoUrl: string; accessToken: string; portfolioId: string } }>(
    '/import',
    async (req, reply) => {
      const { repoUrl, accessToken, portfolioId } = req.body;

      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return reply.status(400).send({ error: 'Invalid GitHub URL' });

      const [, owner, repo] = match;
      const octokit = new Octokit({ auth: accessToken });

      try {
        const [repoData, languages] = await Promise.all([
          octokit.rest.repos.get({ owner, repo }),
          octokit.rest.repos.listLanguages({ owner, repo }),
        ]);

        const metadata: RepoMetadata = {
          stars: repoData.data.stargazers_count,
          forks: repoData.data.forks_count,
          lastUpdated: new Date(repoData.data.updated_at),
          languageBreakdown: languages.data as Record<string, number>,
          topics: repoData.data.topics ?? [],
        };

        // Save to DB
        const project = await prisma.project.create({
          data: {
            portfolioId,
            type: 'github-repo',
            url: repoUrl,
            title: repoData.data.name,
            description: repoData.data.description ?? '',
            primaryLanguage: repoData.data.language ?? '',
            techStack: repoData.data.topics ?? [],
            isRunnable: false,
            order: 0,
            metadata,
          },
        });

        return reply.send({ project });
      } catch (err: any) {
        return reply.status(502).send({ error: 'GitHub API error', detail: err.message });
      }
    }
  );

  // GET /api/github/repos
  // Fetches all repos from the authenticated user's GitHub profile
  app.get<{ Querystring: { accessToken: string } }>(
    '/repos',
    async (req, reply) => {
      const { accessToken } = req.query;
      const octokit = new Octokit({ auth: accessToken });

      try {
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
          sort: 'updated',
          per_page: 50,
        });

        return reply.send({
          repos: data.map((r) => ({
            name: r.name,
            url: r.html_url,
            description: r.description ?? '',
            language: r.language,
            stars: r.stargazers_count,
            updatedAt: r.updated_at,
          })),
        });
      } catch (err: any) {
        return reply.status(502).send({ error: 'GitHub API error', detail: err.message });
      }
    }
  );
}