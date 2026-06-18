import type { FastifyInstance } from 'fastify';
import { Octokit } from 'octokit';
import type { RepoMetadata } from '@hehhi/types';

export async function githubRoutes(app: FastifyInstance) {
  app.post<{ Body: { repoUrl: string; accessToken: string } }>('/import', async (req, reply) => {
    const { repoUrl, accessToken } = req.body;
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
      return reply.send({
        title: repoData.data.name,
        description: repoData.data.description ?? '',
        primaryLanguage: repoData.data.language,
        metadata,
      });
    } catch (err: any) {
      return reply.status(502).send({ error: 'GitHub API error', detail: err.message });
    }
  });
}
