import { Router, Request, Response } from 'express';
import { projectStore, IProject } from '../models/Project.ts';

export const projectsRouter = Router();

// GET all projects for current user (or demo student)
projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || 'student-1';
    const projects = await projectStore.findByUser(userId);
    res.json({ projects });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// GET single project by ID
projectsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await projectStore.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch project', details: err.message });
  }
});

// CREATE a project
projectsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, language, code, output, userId, userName, tags } = req.body;
    if (!title || !code) {
      return res.status(400).json({ error: 'Title and code are required' });
    }

    const created = await projectStore.create({
      title,
      language: language || 'python',
      code,
      output: output || '',
      userId: userId || 'student-1',
      userName: userName || 'Devashtra Student',
      tags: tags || [],
    });

    res.status(201).json({ success: true, project: created });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save project', details: err.message });
  }
});

// UPDATE an existing project
projectsRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await projectStore.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, project: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});

// DELETE a project
projectsRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await projectStore.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
});

// ADD MENTOR REVIEW
projectsRouter.post('/:id/review', async (req: Request, res: Response) => {
  try {
    const { mentorId, mentorName, feedback, rating, status } = req.body;
    if (!feedback) {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    const updated = await projectStore.addReview(req.params.id, {
      mentorId: mentorId || 'usr-mentor-01',
      mentorName: mentorName || 'Dr. Vikram Patel',
      feedback,
      rating: rating ? Number(rating) : 5,
      status: status === 'changes_requested' ? 'changes_requested' : 'approved',
    });

    if (!updated) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, message: 'Review successfully recorded!', project: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record mentor review', details: err.message });
  }
});
