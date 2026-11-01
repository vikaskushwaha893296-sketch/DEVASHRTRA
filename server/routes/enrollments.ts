import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.ts';
import { enrollmentStore } from '../models/Enrollment.ts';
import { batchStore } from '../models/Batch.ts';
import { UserRepository } from '../models/User.ts';

export const enrollmentsRouter = Router();

// GET my enrollments
enrollmentsRouter.get('/my', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const enrollments = await enrollmentStore.findByUser(userId);
    res.json({ success: true, enrollments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ENROLL in a batch
enrollmentsRouter.post('/', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { batchId } = req.body;

    if (!batchId) {
      return res.status(400).json({ success: false, error: 'batchId is required' });
    }

    const batch = await batchStore.getById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, error: 'Batch not found' });
    }

    const enrollment = await enrollmentStore.enroll({
      userId,
      batchId: batch._id || batch.code,
      batchTitle: batch.title,
      batchCategory: batch.category,
    });

    res.status(201).json({ success: true, enrollment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// COMPLETE a lesson in a batch
enrollmentsRouter.post('/:batchId/complete-lesson', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { batchId } = req.params;
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({ success: false, error: 'lessonId is required' });
    }

    const batch = await batchStore.getById(batchId);
    const totalLessons = batch?.lessons?.length || 5;

    const updated = await enrollmentStore.completeLesson(userId, batchId, lessonId, totalLessons);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Enrollment record not found' });
    }

    // Award XP to user profile
    const user = await UserRepository.findById(userId);
    if (user && user.studentDetails) {
      user.studentDetails.xp = (user.studentDetails.xp || 0) + 100;
      await UserRepository.updateStudentXP(userId, user.studentDetails.xp);
    }

    res.json({
      success: true,
      enrollment: updated,
      message: 'Lesson completed! +100 XP awarded.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all enrollments (Admin/Mentor)
enrollmentsRouter.get('/all', verifyToken, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const all = await enrollmentStore.getAll();
    res.json({ success: true, count: all.length, enrollments: all });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
