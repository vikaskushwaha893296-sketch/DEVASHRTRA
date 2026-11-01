import mongoose, { Schema, Document } from 'mongoose';
import { isMongoConnected } from '../db.ts';

export interface ICopilotMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface ICopilotChat {
  _id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  topic: string;
  language: string;
  codeSnippet?: string;
  messages: ICopilotMessage[];
  safetyFlag: 'clean' | 'flagged';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICopilotChatDocument extends Omit<ICopilotChat, '_id'>, Document {}

const CopilotChatSchema = new Schema<ICopilotChatDocument>(
  {
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    userName: { type: String, default: 'Devashtra Student' },
    topic: { type: String, default: 'Python Logic & Algorithms' },
    language: { type: String, default: 'python' },
    codeSnippet: { type: String, default: '' },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    safetyFlag: { type: String, enum: ['clean', 'flagged'], default: 'clean' },
  },
  { timestamps: true }
);

export const CopilotChatModel =
  mongoose.models.CopilotChat || mongoose.model<ICopilotChatDocument>('CopilotChat', CopilotChatSchema);

// In-Memory store
const memoryChats: ICopilotChat[] = [
  {
    _id: 'chat-1',
    userId: 'student-1',
    userEmail: 'student@devashtra.com',
    userName: 'Aarav Chen',
    topic: 'Debugging binary search off-by-one error',
    language: 'python',
    codeSnippet: 'def binary_search(arr, target):\n    low = 0\n    high = len(arr)',
    messages: [
      {
        role: 'user',
        text: 'My loop is giving an IndexError on the last element. Why?',
        timestamp: new Date(Date.now() - 3600000 * 2),
      },
      {
        role: 'assistant',
        text: 'Take a close look at high = len(arr). Remember Python lists are 0-indexed! What is the valid index of the very last element in arr?',
        timestamp: new Date(Date.now() - 3600000 * 2 + 10000),
      },
      {
        role: 'user',
        text: 'Oh! len(arr) - 1. Thanks!',
        timestamp: new Date(Date.now() - 3600000 * 2 + 25000),
      },
      {
        role: 'assistant',
        text: 'Spot on! Test your code again with an array of length 1 to verify boundary edge cases.',
        timestamp: new Date(Date.now() - 3600000 * 2 + 35000),
      },
    ],
    safetyFlag: 'clean',
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(Date.now() - 3600000 * 2 + 35000),
  },
];

export const copilotChatStore = {
  async findByUser(userId: string): Promise<ICopilotChat[]> {
    if (isMongoConnected()) {
      return CopilotChatModel.find({ userId }).sort({ updatedAt: -1 }).limit(50).lean();
    }
    return memoryChats
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  },

  async findByParentChild(childId: string): Promise<ICopilotChat[]> {
    return this.findByUser(childId);
  },

  async logChat(data: {
    userId: string;
    userEmail: string;
    userName?: string;
    topic?: string;
    language?: string;
    codeSnippet?: string;
    messages: { role: 'user' | 'assistant'; text: string }[];
  }): Promise<ICopilotChat> {
    const formattedMessages = data.messages.map((m) => ({
      ...m,
      timestamp: new Date(),
    }));

    if (isMongoConnected()) {
      const created = await CopilotChatModel.create({
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName || 'Devashtra Student',
        topic: data.topic || 'Coding Session',
        language: data.language || 'python',
        codeSnippet: data.codeSnippet || '',
        messages: formattedMessages,
        safetyFlag: 'clean',
      });
      return created.toObject();
    }

    const newChat: ICopilotChat = {
      _id: `chat-${Date.now()}`,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName || 'Devashtra Student',
      topic: data.topic || 'Coding Session',
      language: data.language || 'python',
      codeSnippet: data.codeSnippet || '',
      messages: formattedMessages,
      safetyFlag: 'clean',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryChats.unshift(newChat);
    return newChat;
  },

  async getAll(): Promise<ICopilotChat[]> {
    if (isMongoConnected()) {
      return CopilotChatModel.find().sort({ updatedAt: -1 }).limit(100).lean();
    }
    return [...memoryChats];
  },
};
