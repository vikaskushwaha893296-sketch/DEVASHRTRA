import mongoose, { Schema, Document } from 'mongoose';
import { isMongoConnected } from '../db.ts';

export interface IEnrollment {
  _id?: string;
  userId: string;
  batchId: string;
  batchTitle: string;
  batchCategory: string;
  progress: number; // 0 to 100
  completedLessons: string[];
  xpEarned: number;
  status: 'active' | 'completed' | 'paused';
  enrolledAt: Date;
  lastAccessedAt: Date;
}

export interface IEnrollmentDocument extends Omit<IEnrollment, '_id'>, Document {}

const EnrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    userId: { type: String, required: true, index: true },
    batchId: { type: String, required: true, index: true },
    batchTitle: { type: String, required: true },
    batchCategory: { type: String, default: 'core' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: String }],
    xpEarned: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
    enrolledAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ userId: 1, batchId: 1 }, { unique: true });

export const EnrollmentModel =
  mongoose.models.Enrollment || mongoose.model<IEnrollmentDocument>('Enrollment', EnrollmentSchema);

// In-Memory fallback store
const memoryEnrollments: IEnrollment[] = [
  {
    _id: 'enr-1',
    userId: 'student-1',
    batchId: 'batch-1',
    batchTitle: 'Zero-to-Hero Python Foundations',
    batchCategory: 'core',
    progress: 45,
    completedLessons: ['les-1', 'les-2'],
    xpEarned: 250,
    status: 'active',
    enrolledAt: new Date(Date.now() - 14 * 86400000),
    lastAccessedAt: new Date(),
  },
  {
    _id: 'enr-2',
    userId: 'student-1',
    batchId: 'batch-2',
    batchTitle: 'Full-Stack JavaScript & Node.js Engine',
    batchCategory: 'advanced',
    progress: 20,
    completedLessons: ['les-1'],
    xpEarned: 150,
    status: 'active',
    enrolledAt: new Date(Date.now() - 7 * 86400000),
    lastAccessedAt: new Date(),
  },
];

export const enrollmentStore = {
  async findByUser(userId: string): Promise<IEnrollment[]> {
    if (isMongoConnected()) {
      return EnrollmentModel.find({ userId }).sort({ lastAccessedAt: -1 }).lean();
    }
    return memoryEnrollments.filter((e) => e.userId === userId);
  },

  async findOne(userId: string, batchId: string): Promise<IEnrollment | null> {
    if (isMongoConnected()) {
      return EnrollmentModel.findOne({ userId, batchId }).lean();
    }
    return memoryEnrollments.find((e) => e.userId === userId && e.batchId === batchId) || null;
  },

  async enroll(data: {
    userId: string;
    batchId: string;
    batchTitle: string;
    batchCategory?: string;
  }): Promise<IEnrollment> {
    if (isMongoConnected()) {
      const existing = await EnrollmentModel.findOne({ userId: data.userId, batchId: data.batchId });
      if (existing) {
        return existing.toObject();
      }
      const created = await EnrollmentModel.create({
        userId: data.userId,
        batchId: data.batchId,
        batchTitle: data.batchTitle,
        batchCategory: data.batchCategory || 'core',
        progress: 0,
        completedLessons: [],
        xpEarned: 50,
        status: 'active',
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
      });
      return created.toObject();
    }

    const existing = memoryEnrollments.find((e) => e.userId === data.userId && e.batchId === data.batchId);
    if (existing) return existing;

    const newEnrollment: IEnrollment = {
      _id: `enr-${Date.now()}`,
      userId: data.userId,
      batchId: data.batchId,
      batchTitle: data.batchTitle,
      batchCategory: data.batchCategory || 'core',
      progress: 0,
      completedLessons: [],
      xpEarned: 50,
      status: 'active',
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
    };
    memoryEnrollments.push(newEnrollment);
    return newEnrollment;
  },

  async completeLesson(
    userId: string,
    batchId: string,
    lessonId: string,
    totalBatchLessons: number = 5
  ): Promise<IEnrollment | null> {
    if (isMongoConnected()) {
      const doc = await EnrollmentModel.findOne({ userId, batchId });
      if (!doc) return null;

      if (!doc.completedLessons.includes(lessonId)) {
        doc.completedLessons.push(lessonId);
        doc.xpEarned += 100;
        doc.progress = Math.min(100, Math.round((doc.completedLessons.length / totalBatchLessons) * 100));
        if (doc.progress >= 100) {
          doc.status = 'completed';
        }
      }
      doc.lastAccessedAt = new Date();
      await doc.save();
      return doc.toObject();
    }

    const item = memoryEnrollments.find((e) => e.userId === userId && e.batchId === batchId);
    if (!item) return null;

    if (!item.completedLessons.includes(lessonId)) {
      item.completedLessons.push(lessonId);
      item.xpEarned += 100;
      item.progress = Math.min(100, Math.round((item.completedLessons.length / totalBatchLessons) * 100));
      if (item.progress >= 100) {
        item.status = 'completed';
      }
    }
    item.lastAccessedAt = new Date();
    return item;
  },

  async getAll(): Promise<IEnrollment[]> {
    if (isMongoConnected()) {
      return EnrollmentModel.find().lean();
    }
    return [...memoryEnrollments];
  },
};
