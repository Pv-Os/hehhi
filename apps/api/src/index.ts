import Fastify from 'fastify';
import cors from '@fastify/cors';
import { portfolioRoutes } from './routes/portfolio';
import { amaRoutes } from './routes/ama';
import { terminalRoutes } from './routes/terminal';
import { githubRoutes } from './routes/github';

const app = Fastify({ logger: true });

app.register(cors, {
  origin: process.env.NEXT_PUBLIC_APP_URL,
  credentials: true,
});

app.register(portfolioRoutes, { prefix: '/api/portfolio' });
app.register(amaRoutes,       { prefix: '/api/ama' });
app.register(terminalRoutes,  { prefix: '/api/terminal' });
app.register(githubRoutes,    { prefix: '/api/github' });

app.get('/health', async () => ({ status: 'ok' }));

app.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
});
