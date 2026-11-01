import mongoose, { Schema, Document } from 'mongoose';
import { isMongoConnected } from '../db.ts';

export interface IParentChildLink {
  _id?: string;
  parentId: string;
  parentEmail: string;
  childId: string;
  childName: string;
  childEmail: string;
  relationship: 'mother' | 'father' | 'guardian';
  dailyScreenTimeMinutes: number;
  aiCopilotEnabled: boolean;
  status: 'active' | 'pending';
  linkedAt: Date;
}

export interface IParentChildLinkDocument extends Omit<IParentChildLink, '_id'>, Document {}

const ParentChildLinkSchema = new Schema<IParentChildLinkDocument>(
  {
    parentId: { type: String, required: true, index: true },
    parentEmail: { type: String, required: true },
    childId: { type: String, required: true, index: true },
    childName: { type: String, required: true },
    childEmail: { type: String, required: true },
    relationship: { type: String, enum: ['mother', 'father', 'guardian'], default: 'guardian' },
    dailyScreenTimeMinutes: { type: Number, default: 45 },
    aiCopilotEnabled: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'pending'], default: 'active' },
    linkedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ParentChildLinkModel =
  mongoose.models.ParentChildLink ||
  mongoose.model<IParentChildLinkDocument>('ParentChildLink', ParentChildLinkSchema);

// In-Memory store
const memoryLinks: IParentChildLink[] = [
  {
    _id: 'link-1',
    parentId: 'usr-parent-01',
    parentEmail: 'parent@devashtra.com',
    childId: 'usr-student-01',
    childName: 'Aarav Chen',
    childEmail: 'student@devashtra.com',
    relationship: 'father',
    dailyScreenTimeMinutes: 45,
    aiCopilotEnabled: true,
    status: 'active',
    linkedAt: new Date(Date.now() - 30 * 86400000),
  },
];

export const parentChildStore = {
  async findByParent(parentId: string): Promise<IParentChildLink[]> {
    if (isMongoConnected()) {
      return ParentChildLinkModel.find({ parentId }).lean();
    }
    return memoryLinks.filter((l) => l.parentId === parentId);
  },

  async findByChild(childId: string): Promise<IParentChildLink | null> {
    if (isMongoConnected()) {
      return ParentChildLinkModel.findOne({ childId }).lean();
    }
    return memoryLinks.find((l) => l.childId === childId) || null;
  },

  async createLink(data: {
    parentId: string;
    parentEmail: string;
    childId: string;
    childName: string;
    childEmail: string;
    relationship?: 'mother' | 'father' | 'guardian';
    dailyScreenTimeMinutes?: number;
  }): Promise<IParentChildLink> {
    if (isMongoConnected()) {
      const created = await ParentChildLinkModel.create({
        parentId: data.parentId,
        parentEmail: data.parentEmail,
        childId: data.childId,
        childName: data.childName,
        childEmail: data.childEmail,
        relationship: data.relationship || 'guardian',
        dailyScreenTimeMinutes: data.dailyScreenTimeMinutes || 45,
        aiCopilotEnabled: true,
        status: 'active',
        linkedAt: new Date(),
      });
      return created.toObject();
    }

    const newLink: IParentChildLink = {
      _id: `link-${Date.now()}`,
      parentId: data.parentId,
      parentEmail: data.parentEmail,
      childId: data.childId,
      childName: data.childName,
      childEmail: data.childEmail,
      relationship: data.relationship || 'guardian',
      dailyScreenTimeMinutes: data.dailyScreenTimeMinutes || 45,
      aiCopilotEnabled: true,
      status: 'active',
      linkedAt: new Date(),
    };
    memoryLinks.push(newLink);
    return newLink;
  },

  async updateLimits(
    parentId: string,
    childId: string,
    updates: { dailyScreenTimeMinutes?: number; aiCopilotEnabled?: boolean }
  ): Promise<IParentChildLink | null> {
    if (isMongoConnected()) {
      const doc = await ParentChildLinkModel.findOne({ parentId, childId });
      if (!doc) return null;
      if (updates.dailyScreenTimeMinutes !== undefined) doc.dailyScreenTimeMinutes = updates.dailyScreenTimeMinutes;
      if (updates.aiCopilotEnabled !== undefined) doc.aiCopilotEnabled = updates.aiCopilotEnabled;
      await doc.save();
      return doc.toObject();
    }

    const item = memoryLinks.find((l) => l.parentId === parentId && l.childId === childId);
    if (!item) return null;
    if (updates.dailyScreenTimeMinutes !== undefined) item.dailyScreenTimeMinutes = updates.dailyScreenTimeMinutes;
    if (updates.aiCopilotEnabled !== undefined) item.aiCopilotEnabled = updates.aiCopilotEnabled;
    return item;
  },
};
