import { Router, Response } from 'express';
import { verifyToken, requireRole, AuthenticatedRequest } from '../middleware/auth.ts';
import { UserRepository } from '../models/User.ts';
import { WaitlistRepository } from '../models/Waitlist.ts';
import { isMongoConnected } from '../db.ts';

export const dashboardRouter = Router();

// Student Dashboard Data
dashboardRouter.get(
  '/student',
  verifyToken,
  requireRole(['student', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await UserRepository.findById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.json({
        success: true,
        student: {
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          ...user.studentDetails,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve student dashboard';
      return res.status(500).json({ success: false, error: msg });
    }
  }
);

// Parental Dashboard Data
dashboardRouter.get(
  '/parent',
  verifyToken,
  requireRole(['parent', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await UserRepository.findById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.json({
        success: true,
        parent: {
          name: user.name,
          email: user.email,
          role: user.role,
          ...user.parentDetails,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve parent dashboard';
      return res.status(500).json({ success: false, error: msg });
    }
  }
);

// Parent screen time limit update
dashboardRouter.patch(
  '/parent/screentime',
  verifyToken,
  requireRole(['parent', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { minutes } = req.body;
      const parsedMinutes = Number(minutes);
      if (isNaN(parsedMinutes) || parsedMinutes < 15 || parsedMinutes > 240) {
        return res.status(400).json({ success: false, error: 'Allowed minutes must be between 15 and 240.' });
      }

      await UserRepository.updateParentScreenTime(req.user!.userId, parsedMinutes);
      return res.json({
        success: true,
        message: `Daily screen time budget updated to ${parsedMinutes} minutes.`,
        allowedDailyMinutes: parsedMinutes,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update screen time';
      return res.status(500).json({ success: false, error: msg });
    }
  }
);

// Mentor Dashboard Data
dashboardRouter.get(
  '/mentor',
  verifyToken,
  requireRole(['mentor', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await UserRepository.findById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.json({
        success: true,
        mentor: {
          name: user.name,
          email: user.email,
          role: user.role,
          ...user.mentorDetails,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve mentor dashboard';
      return res.status(500).json({ success: false, error: msg });
    }
  }
);

// Admin Dashboard Data
dashboardRouter.get(
  '/admin',
  verifyToken,
  requireRole(['admin']),
  async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const [allUsers, waitlistStats, allWaitlist] = await Promise.all([
        UserRepository.getAllUsers(),
        WaitlistRepository.getStats(),
        WaitlistRepository.getAll(),
      ]);

      const roleBreakdown: Record<string, number> = {
        student: 0,
        parent: 0,
        mentor: 0,
        admin: 0,
      };

      allUsers.forEach((u) => {
        roleBreakdown[u.role] = (roleBreakdown[u.role] || 0) + 1;
      });

      return res.json({
        success: true,
        metrics: {
          totalRegisteredUsers: allUsers.length,
          roleBreakdown,
          waitlistCount: waitlistStats.total,
          isMongoConnected: isMongoConnected(),
          databaseEngine: isMongoConnected() ? 'MongoDB Atlas' : 'Devashtra Memory Store',
        },
        users: allUsers,
        waitlist: allWaitlist,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve admin dashboard';
      return res.status(500).json({ success: false, error: msg });
    }
  }
);
