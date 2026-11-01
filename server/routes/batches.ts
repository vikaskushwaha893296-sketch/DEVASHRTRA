import { Router, Request, Response } from 'express';
import { batchStore } from '../models/Batch.ts';

export const batchesRouter = Router();

// GET all batches
batchesRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const batches = await batchStore.getAll();
    res.json({ batches });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch batches', details: err.message });
  }
});

// GET single batch by ID or code
batchesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const batch = await batchStore.getById(req.params.id);
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json({ batch });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch batch', details: err.message });
  }
});

// CREATE new batch (Admin only or verified instructor)
batchesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, code, category, level, description, instructorName, lessons, schedule, durationWeeks } = req.body;
    if (!title || !code) {
      return res.status(400).json({ error: 'Batch title and unique code are required' });
    }

    const created = await batchStore.create({
      title,
      code,
      category: category || 'core',
      level: level || 'Beginner',
      description: description || 'New cohort batch',
      instructorName: instructorName || 'Devashtra Mentor',
      lessons: lessons || [],
      schedule: schedule || 'Mon & Wed • 6:00 PM IST',
      durationWeeks: durationWeeks || 6,
    });

    res.status(201).json({ success: true, batch: created });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create batch', details: err.message });
  }
});

// In-Memory Enrollment records
const enrollments: Record<string, string[]> = {
  'student-1': ['batch-1', 'batch-2'],
};

// ENROLL student in batch
batchesRouter.post('/:id/enroll', async (req: Request, res: Response) => {
  const batchId = req.params.id;
  const userId = req.body.userId || 'student-1';

  if (!enrollments[userId]) {
    enrollments[userId] = [];
  }

  if (!enrollments[userId].includes(batchId)) {
    enrollments[userId].push(batchId);
  }

  res.json({
    success: true,
    message: 'Successfully enrolled in batch!',
    enrolledBatches: enrollments[userId],
  });
});

// GET enrolled batches for a user
batchesRouter.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const userEnrolledIds = enrollments[userId] || ['batch-1'];
  const allBatches = await batchStore.getAll();
  const enrolled = allBatches.filter((b) => userEnrolledIds.includes(b._id || ''));

  res.json({ enrolled });
});
