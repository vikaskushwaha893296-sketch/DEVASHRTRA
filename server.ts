import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isMongoConnected } from './server/db.ts';
import { waitlistRouter } from './server/routes/waitlist.ts';
import { authRouter } from './server/routes/auth.ts';
import { dashboardRouter } from './server/routes/dashboard.ts';
import { aiRouter } from './server/routes/ai.ts';
import { sandboxRouter } from './server/routes/sandbox.ts';
import { projectsRouter } from './server/routes/projects.ts';
import { batchesRouter } from './server/routes/batches.ts';
import { enrollmentsRouter } from './server/routes/enrollments.ts';
import { chatRouter } from './server/routes/chat.ts';
import { badgesRouter } from './server/routes/badges.ts';
import { parentRouter } from './server/routes/parent.ts';
import { juniorRouter } from './server/routes/junior.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to Database asynchronously
  await connectDB();

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      app: 'Devashtra',
      tagline: 'Bridging the gap between passive learning and real-world tech execution',
      database: isMongoConnected() ? 'MongoDB Atlas (Connected)' : 'Devashtra In-Memory Store (Active)',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      modules: ['auth', 'dashboard', 'sandbox', 'ai', 'batches', 'projects', 'enrollments', 'chat', 'badges', 'parent', 'junior'],
      phase: 'Comprehensive Full-Stack Backend Operational',
    });
  });

  // Mount API routers
  app.use('/api/auth', authRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/waitlist', waitlistRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/sandbox', sandboxRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/batches', batchesRouter);
  app.use('/api/enrollments', enrollmentsRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/badges', badgesRouter);
  app.use('/api/parent', parentRouter);
  app.use('/api/junior', juniorRouter);

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Devashtra Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Devashtra Engine] Fatal error starting server:', err);
});
