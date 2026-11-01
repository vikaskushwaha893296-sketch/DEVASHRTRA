import { Router, Request, Response } from 'express';
import { WaitlistRepository } from '../models/Waitlist.ts';

export const waitlistRouter = Router();

// POST /api/waitlist
waitlistRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { email, fullName, role, experienceLevel, interestTrack, studentAge, notes } = req.body;

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your full name (minimum 2 characters).',
      });
    }

    const validRoles = ['student', 'parent', 'mentor', 'educator', 'other'];
    const chosenRole = validRoles.includes(role) ? role : 'student';

    const validLevels = ['beginner', 'intermediate', 'advanced', 'curious_child'];
    const chosenLevel = validLevels.includes(experienceLevel) ? experienceLevel : 'beginner';

    let parsedAge: number | undefined = undefined;
    if (studentAge !== undefined && studentAge !== null && studentAge !== '') {
      const num = Number(studentAge);
      if (!isNaN(num) && num >= 4 && num <= 100) {
        parsedAge = num;
      }
    }

    const result = await WaitlistRepository.create({
      email: email.trim(),
      fullName: fullName.trim(),
      role: chosenRole,
      experienceLevel: chosenLevel,
      interestTrack: interestTrack?.trim() || 'Cloud Lab & AI Copilot',
      studentAge: parsedAge,
      notes: notes ? String(notes).trim().slice(0, 500) : undefined,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome to Devashtra, ${fullName.trim()}! You have secured position #${result.queuePosition} on our exclusive early access list.`,
      queuePosition: result.queuePosition,
      entry: {
        email: result.entry.email,
        fullName: result.entry.fullName,
        role: result.entry.role,
        interestTrack: result.entry.interestTrack,
        createdAt: result.entry.createdAt,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to join waitlist';
    if (message.includes('already on the waitlist')) {
      return res.status(409).json({
        success: false,
        error: 'This email is already registered on our waitlist. We will reach out soon!',
      });
    }
    return res.status(500).json({
      success: false,
      error: message,
    });
  }
});

// GET /api/waitlist/stats
waitlistRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await WaitlistRepository.getStats();
    return res.json({
      success: true,
      ...stats,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load stats';
    return res.status(500).json({ success: false, error: message });
  }
});

// GET /api/waitlist
waitlistRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const entries = await WaitlistRepository.getAll();
    return res.json({
      success: true,
      count: entries.length,
      entries,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load waitlist entries';
    return res.status(500).json({ success: false, error: message });
  }
});
