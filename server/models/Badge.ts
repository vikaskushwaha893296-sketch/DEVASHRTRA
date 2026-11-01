import mongoose, { Schema, Document } from 'mongoose';
import { isMongoConnected } from '../db.ts';

export interface IBadge {
  _id?: string;
  id: string;
  title: string;
  description: string;
  category: 'python' | 'junior' | 'cyber_safety' | 'streak' | 'mentor' | 'general';
  icon: string;
  xpReward: number;
}

export interface IBadgeDocument extends Omit<IBadge, '_id'>, Document {}

const BadgeSchema = new Schema<IBadgeDocument>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['python', 'junior', 'cyber_safety', 'streak', 'mentor', 'general'],
    default: 'general',
  },
  icon: { type: String, default: '🏆' },
  xpReward: { type: Number, default: 100 },
});

export const BadgeModel =
  mongoose.models.Badge || mongoose.model<IBadgeDocument>('Badge', BadgeSchema);

// Preset Devashtra Badges
export const PRESET_BADGES: IBadge[] = [
  {
    id: 'badge-python-pioneer',
    title: 'Python Pioneer',
    description: 'Executed your first 10 Python scripts with zero syntax errors.',
    category: 'python',
    icon: '🐍',
    xpReward: 150,
  },
  {
    id: 'badge-junior-space-coder',
    title: 'Space Cadet Programmer',
    description: 'Completed Mission 1 in Devashtra Junior by decoding the Mars Rover telemetry.',
    category: 'junior',
    icon: '🚀',
    xpReward: 200,
  },
  {
    id: 'badge-cipher-master',
    title: 'Cipher Master',
    description: 'Solved the Caesar Cipher puzzle without looking at hints.',
    category: 'cyber_safety',
    icon: '🛡️',
    xpReward: 175,
  },
  {
    id: 'badge-streak-7',
    title: '7-Day Code Fire',
    description: 'Maintained a coding streak for 7 consecutive calendar days.',
    category: 'streak',
    icon: '🔥',
    xpReward: 300,
  },
  {
    id: 'badge-copilot-scholar',
    title: 'Socratic Scholar',
    description: 'Used AI Copilot to understand 5 tricky algorithm bottlenecks.',
    category: 'python',
    icon: '🧠',
    xpReward: 120,
  },
  {
    id: 'badge-clean-code',
    title: 'Clean Code Knight',
    description: 'Submitted code that passed all automated test suites on first attempt.',
    category: 'mentor',
    icon: '⚔️',
    xpReward: 250,
  },
];

// In-Memory store
const memoryBadges: IBadge[] = [...PRESET_BADGES];

// User earned badges mapping
const userEarnedBadges: Record<string, { badgeId: string; earnedAt: Date }[]> = {
  'student-1': [
    { badgeId: 'badge-python-pioneer', earnedAt: new Date(Date.now() - 86400000 * 5) },
    { badgeId: 'badge-junior-space-coder', earnedAt: new Date(Date.now() - 86400000 * 3) },
    { badgeId: 'badge-streak-7', earnedAt: new Date(Date.now() - 86400000) },
  ],
  'usr-student-01': [
    { badgeId: 'badge-python-pioneer', earnedAt: new Date(Date.now() - 86400000 * 5) },
    { badgeId: 'badge-junior-space-coder', earnedAt: new Date(Date.now() - 86400000 * 3) },
    { badgeId: 'badge-streak-7', earnedAt: new Date(Date.now() - 86400000) },
  ],
};

export const badgeStore = {
  async getAll(): Promise<IBadge[]> {
    if (isMongoConnected()) {
      return BadgeModel.find().lean();
    }
    return memoryBadges;
  },

  async getUserBadges(userId: string): Promise<{ badge: IBadge; earnedAt: Date }[]> {
    const records = userEarnedBadges[userId] || [];
    const all = await this.getAll();
    return records
      .map((r) => {
        const badge = all.find((b) => b.id === r.badgeId);
        return badge ? { badge, earnedAt: r.earnedAt } : null;
      })
      .filter((b): b is { badge: IBadge; earnedAt: Date } => b !== null);
  },

  async awardBadge(userId: string, badgeId: string): Promise<{ success: boolean; badge?: IBadge }> {
    if (!userEarnedBadges[userId]) {
      userEarnedBadges[userId] = [];
    }

    const alreadyEarned = userEarnedBadges[userId].some((b) => b.badgeId === badgeId);
    if (alreadyEarned) {
      return { success: false };
    }

    const all = await this.getAll();
    const targetBadge = all.find((b) => b.id === badgeId);
    if (!targetBadge) {
      return { success: false };
    }

    userEarnedBadges[userId].push({
      badgeId,
      earnedAt: new Date(),
    });

    return { success: true, badge: targetBadge };
  },
};
