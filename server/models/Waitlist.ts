import mongoose, { Schema, Document } from 'mongoose';
import { isMongoConnected } from '../db.ts';

export interface IWaitlistEntry {
  email: string;
  fullName: string;
  role: 'student' | 'parent' | 'mentor' | 'educator' | 'other';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'curious_child';
  interestTrack: string;
  studentAge?: number;
  notes?: string;
  status: 'pending' | 'invited' | 'admitted';
  createdAt: Date;
}

export interface IWaitlistDocument extends IWaitlistEntry, Document {}

const WaitlistSchema = new Schema<IWaitlistDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'parent', 'mentor', 'educator', 'other'],
      default: 'student',
    },
    experienceLevel: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced', 'curious_child'],
      default: 'beginner',
    },
    interestTrack: {
      type: String,
      default: 'Cloud Lab & AI Copilot',
    },
    studentAge: {
      type: Number,
      min: [4, 'Age must be at least 4'],
      max: [100, 'Age must be under 100'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'invited', 'admitted'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation in development
export const WaitlistModel =
  mongoose.models.Waitlist ||
  mongoose.model<IWaitlistDocument>('Waitlist', WaitlistSchema);

// In-memory persistent fallback repository
interface StoredEntry extends IWaitlistEntry {
  _id: string;
}

const memoryStore: StoredEntry[] = [
  {
    _id: 'seed-1',
    email: 'alex.chen@example.com',
    fullName: 'Alex Chen',
    role: 'student',
    experienceLevel: 'intermediate',
    interestTrack: 'Fullstack & Cloud Lab',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    _id: 'seed-2',
    email: 'sarah.m@example.org',
    fullName: 'Sarah Miller',
    role: 'parent',
    experienceLevel: 'curious_child',
    interestTrack: 'Devashtra Junior (Ages 6-12)',
    studentAge: 8,
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    _id: 'seed-3',
    email: 'priya.sharma@example.edu',
    fullName: 'Priya Sharma',
    role: 'mentor',
    experienceLevel: 'advanced',
    interestTrack: 'AI Copilot & Mentorship Batches',
    status: 'invited',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
];

export const WaitlistRepository = {
  async create(data: Partial<IWaitlistEntry>): Promise<{ entry: IWaitlistEntry; queuePosition: number }> {
    const normalizedEmail = (data.email || '').trim().toLowerCase();

    if (isMongoConnected()) {
      const existing = await WaitlistModel.findOne({ email: normalizedEmail });
      if (existing) {
        throw new Error('This email address is already on the waitlist.');
      }
      const created = await WaitlistModel.create({
        ...data,
        email: normalizedEmail,
        createdAt: new Date(),
      });
      const count = await WaitlistModel.countDocuments();
      return { entry: created.toObject(), queuePosition: count };
    } else {
      const existing = memoryStore.find((e) => e.email === normalizedEmail);
      if (existing) {
        throw new Error('This email address is already on the waitlist.');
      }
      const newEntry: StoredEntry = {
        _id: 'mem-' + Math.random().toString(36).substring(2, 9),
        email: normalizedEmail,
        fullName: data.fullName?.trim() || 'Anonymous Learner',
        role: data.role || 'student',
        experienceLevel: data.experienceLevel || 'beginner',
        interestTrack: data.interestTrack || 'Cloud Lab & AI Copilot',
        studentAge: data.studentAge,
        notes: data.notes?.trim(),
        status: 'pending',
        createdAt: new Date(),
      };
      memoryStore.unshift(newEntry);
      return { entry: newEntry, queuePosition: memoryStore.length };
    }
  },

  async getAll(): Promise<IWaitlistEntry[]> {
    if (isMongoConnected()) {
      return WaitlistModel.find().sort({ createdAt: -1 }).lean();
    }
    return [...memoryStore];
  },

  async count(): Promise<number> {
    if (isMongoConnected()) {
      return WaitlistModel.countDocuments();
    }
    return memoryStore.length;
  },

  async getStats() {
    const all = await this.getAll();
    const roleCounts: Record<string, number> = {};
    const trackCounts: Record<string, number> = {};

    all.forEach((item) => {
      roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
      const track = item.interestTrack || 'General Tech';
      trackCounts[track] = (trackCounts[track] || 0) + 1;
    });

    return {
      total: all.length,
      roleBreakdown: roleCounts,
      trackBreakdown: trackCounts,
      isMongoBacked: isMongoConnected(),
    };
  },
};
