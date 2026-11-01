import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.ts';
import { badgeStore, PRESET_BADGES } from '../models/Badge.ts';

export const badgesRouter = Router();

// GET all available platform badges
badgesRouter.get('/', async (_req, res: Response) => {
  try {
    const badges = await badgeStore.getAll();
    res.json({ success: true, badges });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET my earned badges
badgesRouter.get('/my', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const earned = await badgeStore.getUserBadges(userId);
    res.json({ success: true, badges: earned });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET badges for specific student ID
badgesRouter.get('/user/:userId', async (req, res: Response) => {
  try {
    const earned = await badgeStore.getUserBadges(req.params.userId);
    res.json({ success: true, badges: earned });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AWARD badge to student
badgesRouter.post('/award', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, badgeId } = req.body;
    const targetUserId = userId || req.user!.userId;

    if (!badgeId) {
      return res.status(400).json({ success: false, error: 'badgeId is required' });
    }

    const result = await badgeStore.awardBadge(targetUserId, badgeId);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Badge already earned or invalid badge ID.',
      });
    }

    res.json({
      success: true,
      message: `Congratulations! You unlocked the "${result.badge?.title}" badge!`,
      badge: result.badge,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
