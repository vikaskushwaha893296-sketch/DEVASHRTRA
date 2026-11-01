import { Router, Request, Response } from 'express';
import { UserRepository, UserRole } from '../models/User.ts';
import { signToken, verifyToken, AuthenticatedRequest } from '../middleware/auth.ts';

export const authRouter = Router();

// POST /api/auth/signup
authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters.' });
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const validRoles: UserRole[] = ['student', 'parent', 'mentor', 'admin'];
    const chosenRole: UserRole = validRoles.includes(role) ? role : 'student';

    const user = await UserRepository.create({
      name: name.trim(),
      email: email.trim(),
      password,
      role: chosenRole,
    });

    const token = signToken({
      userId: user._id || 'usr-temp',
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { passwordHash: _, ...safeUser } = user;

    return res.status(201).json({
      success: true,
      message: `Account created successfully. Welcome to Devashtra, ${user.name}!`,
      token,
      user: safeUser,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    const status = message.includes('already exists') ? 409 : 500;
    return res.status(status).json({ success: false, error: message });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const isMatch = await UserRepository.verifyPassword(user, password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = signToken({
      userId: user._id || 'usr-temp',
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return res.status(500).json({ success: false, error: message });
  }
});

// GET /api/auth/me
authRouter.get('/me', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const user = await UserRepository.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve profile';
    return res.status(500).json({ success: false, error: message });
  }
});

// GET /api/auth/demo-users
// Fast 1-click test credentials for evaluators
authRouter.get('/demo-users', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Pre-seeded demo accounts for quick role-based evaluation',
    accounts: [
      { role: 'student', email: 'student@devashtra.com', password: 'password123', label: 'Aarav Chen (Student: 1450 XP, Python Batch)' },
      { role: 'parent', email: 'parent@devashtra.com', password: 'password123', label: 'Sarah Chen (Parent: Linked to Aarav, Screen Time Controls)' },
      { role: 'mentor', email: 'mentor@devashtra.com', password: 'password123', label: 'Dr. Vikram Patel (Mentor: 2 Batches, Pending Reviews)' },
      { role: 'admin', email: 'admin@devashtra.com', password: 'password123', label: 'Operations Admin (Admin: User Management & Platform Stats)' },
    ],
  });
});
