import { Router, Response } from 'express';
import { verifyToken, requireRole, AuthenticatedRequest } from '../middleware/auth.ts';
import { parentChildStore } from '../models/ParentChild.ts';
import { UserRepository } from '../models/User.ts';
import { copilotChatStore } from '../models/CopilotChat.ts';
import { enrollmentStore } from '../models/Enrollment.ts';
import { badgeStore } from '../models/Badge.ts';

export const parentRouter = Router();

// GET all linked children for the logged-in parent
parentRouter.get(
  '/children',
  verifyToken,
  requireRole(['parent', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parentId = req.user!.userId;
      const links = await parentChildStore.findByParent(parentId);

      // Enhance each link with live stats of the child
      const enhancedChildren = await Promise.all(
        links.map(async (link) => {
          const childUser = await UserRepository.findById(link.childId);
          const enrollments = await enrollmentStore.findByUser(link.childId);
          const badges = await badgeStore.getUserBadges(link.childId);
          const chats = await copilotChatStore.findByUser(link.childId);

          return {
            ...link,
            stats: {
              xp: childUser?.studentDetails?.xp || 320,
              level: childUser?.studentDetails?.level || 2,
              currentStreak: childUser?.studentDetails?.currentStreak || 4,
              activeCoursesCount: enrollments.length,
              badgesCount: badges.length,
              recentChatCount: chats.length,
            },
            enrollments,
          };
        })
      );

      res.json({ success: true, children: enhancedChildren });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// LINK a new child account
parentRouter.post(
  '/link',
  verifyToken,
  requireRole(['parent', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parentId = req.user!.userId;
      const parentEmail = req.user!.email;
      const { childEmail, relationship = 'guardian', dailyScreenTimeMinutes = 45 } = req.body;

      if (!childEmail) {
        return res.status(400).json({ success: false, error: 'Child email is required' });
      }

      // Check if student user exists
      const childUser = await UserRepository.findByEmail(childEmail);
      if (!childUser) {
        return res.status(404).json({
          success: false,
          error: 'No student account found with this email. Please ask your child to sign up first.',
        });
      }

      const link = await parentChildStore.createLink({
        parentId,
        parentEmail,
        childId: childUser._id || 'child-id',
        childName: childUser.name,
        childEmail: childUser.email,
        relationship,
        dailyScreenTimeMinutes: Number(dailyScreenTimeMinutes) || 45,
      });

      res.status(201).json({
        success: true,
        message: `Successfully linked ${childUser.name} to your parent portal.`,
        link,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// UPDATE child screen time and permissions
parentRouter.patch(
  '/child/:childId/limits',
  verifyToken,
  requireRole(['parent', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const parentId = req.user!.userId;
      const { childId } = req.params;
      const { dailyScreenTimeMinutes, aiCopilotEnabled } = req.body;

      const updated = await parentChildStore.updateLimits(parentId, childId, {
        dailyScreenTimeMinutes: dailyScreenTimeMinutes !== undefined ? Number(dailyScreenTimeMinutes) : undefined,
        aiCopilotEnabled: aiCopilotEnabled !== undefined ? Boolean(aiCopilotEnabled) : undefined,
      });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Child link not found' });
      }

      res.json({
        success: true,
        message: 'Child safety parameters updated successfully.',
        link: updated,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// AUDIT child's AI Copilot chat history
parentRouter.get(
  '/child/:childId/audit',
  verifyToken,
  requireRole(['parent', 'admin']),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { childId } = req.params;
      const logs = await copilotChatStore.findByParentChild(childId);
      res.json({ success: true, logs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);
