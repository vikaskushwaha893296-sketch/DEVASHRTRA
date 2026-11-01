import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.ts';
import { copilotChatStore } from '../models/CopilotChat.ts';

export const chatRouter = Router();

// GET my chat sessions
chatRouter.get('/history', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const history = await copilotChatStore.findByUser(userId);
    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SAVE a chat session
chatRouter.post('/save', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const userEmail = req.user!.email;
    const { topic, language, codeSnippet, messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Messages array is required' });
    }

    const saved = await copilotChatStore.logChat({
      userId,
      userEmail,
      topic: topic || 'Code Debugging & Socratic Mentorship',
      language: language || 'python',
      codeSnippet: codeSnippet || '',
      messages,
    });

    res.status(201).json({ success: true, chat: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET audit logs for child (Parent, Mentor, or Admin)
chatRouter.get('/audit/:childId', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { childId } = req.params;
    const logs = await copilotChatStore.findByParentChild(childId);
    res.json({ success: true, childId, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
