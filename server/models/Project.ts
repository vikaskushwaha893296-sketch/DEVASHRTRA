import mongoose, { Schema, Document } from 'mongoose';
import { isMongoConnected } from '../db.ts';

export interface IProjectReview {
  id: string;
  mentorId: string;
  mentorName: string;
  feedback: string;
  rating: number; // 1 to 5
  status: 'approved' | 'changes_requested';
  createdAt: Date;
}

export interface IProject {
  _id?: string;
  title: string;
  language: 'python' | 'javascript';
  code: string;
  output?: string;
  userId: string;
  userName?: string;
  isPublic?: boolean;
  tags?: string[];
  reviews?: IProjectReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends Omit<IProject, '_id'>, Document {}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: { type: String, required: true, trim: true },
    language: { type: String, enum: ['python', 'javascript'], default: 'python' },
    code: { type: String, required: true },
    output: { type: String, default: '' },
    userId: { type: String, required: true, index: true },
    userName: { type: String, default: 'Devashtra Student' },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String }],
    reviews: [
      {
        id: String,
        mentorId: String,
        mentorName: String,
        feedback: String,
        rating: Number,
        status: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ProjectModel =
  mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);

// In-Memory Project Store
const inMemoryProjects: IProject[] = [
  {
    _id: 'proj-1',
    title: 'Algorithmic Fibonacci Generator',
    language: 'python',
    code: `# Fibonacci Number Generator with Iterative Performance
def fibonacci_sequence(n):
    """Generate first n Fibonacci numbers."""
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

limit = 10
print(f"Fibonacci sequence ({limit} terms): {fibonacci_sequence(limit)}")
`,
    output: 'Fibonacci sequence (10 terms): [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]',
    userId: 'student-1',
    userName: 'Aarav Sharma',
    isPublic: true,
    tags: ['Algorithms', 'Python', 'Beginner'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 24),
    updatedAt: new Date(),
  },
  {
    _id: 'proj-2',
    title: 'Cyber Safe Caesar Cipher',
    language: 'javascript',
    code: `// Caesar Cipher Encryption & Decryption Module
function encryptCaesar(text, shift = 3) {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }
    return char;
  }).join('');
}

const secret = "DEVASHTRA-SECURE-KEY";
const encrypted = encryptCaesar(secret, 5);
console.log("Plaintext:  " + secret);
console.log("Encrypted:  " + encrypted);
`,
    output: 'Plaintext:  DEVASHTRA-SECURE-KEY\nEncrypted:  IJAFXMYWF-XJHZWJ-PJD',
    userId: 'student-1',
    userName: 'Aarav Sharma',
    isPublic: true,
    tags: ['Junior', 'Cryptography', 'JavaScript'],
    createdAt: new Date(Date.now() - 3600 * 1000 * 48),
    updatedAt: new Date(),
  },
];

export const projectStore = {
  async findByUser(userId: string): Promise<IProject[]> {
    if (isMongoConnected()) {
      try {
        const docs = await ProjectModel.find({ userId }).sort({ updatedAt: -1 }).lean();
        return docs as IProject[];
      } catch {
        // Fall back to memory
      }
    }
    return inMemoryProjects.filter((p) => p.userId === userId || p.userId === 'student-1');
  },

  async findById(id: string): Promise<IProject | null> {
    if (isMongoConnected()) {
      try {
        const doc = await ProjectModel.findById(id).lean();
        if (doc) return doc as IProject;
      } catch {
        // Fall back
      }
    }
    return inMemoryProjects.find((p) => p._id === id) || null;
  },

  async create(data: Partial<IProject>): Promise<IProject> {
    const newProj: IProject = {
      _id: 'proj-' + Date.now().toString(36),
      title: data.title || 'Untitled Project',
      language: data.language || 'python',
      code: data.code || '',
      output: data.output || '',
      userId: data.userId || 'guest-student',
      userName: data.userName || 'Student',
      isPublic: data.isPublic || false,
      tags: data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const doc = await ProjectModel.create(newProj);
        return doc.toObject();
      } catch {
        // Fall back
      }
    }

    inMemoryProjects.unshift(newProj);
    return newProj;
  },

  async update(id: string, updates: Partial<IProject>): Promise<IProject | null> {
    if (isMongoConnected()) {
      try {
        const doc = await ProjectModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).lean();
        if (doc) return doc as IProject;
      } catch {
        // Fall back
      }
    }

    const index = inMemoryProjects.findIndex((p) => p._id === id);
    if (index !== -1) {
      inMemoryProjects[index] = {
        ...inMemoryProjects[index],
        ...updates,
        updatedAt: new Date(),
      };
      return inMemoryProjects[index];
    }
    return null;
  },

  async delete(id: string): Promise<boolean> {
    if (isMongoConnected()) {
      try {
        await ProjectModel.findByIdAndDelete(id);
        return true;
      } catch {
        // Fall back
      }
    }
    const idx = inMemoryProjects.findIndex((p) => p._id === id);
    if (idx !== -1) {
      inMemoryProjects.splice(idx, 1);
      return true;
    }
    return false;
  },

  async addReview(
    projectId: string,
    review: {
      mentorId: string;
      mentorName: string;
      feedback: string;
      rating: number;
      status: 'approved' | 'changes_requested';
    }
  ): Promise<IProject | null> {
    const newReview: IProjectReview = {
      id: 'rev-' + Date.now(),
      mentorId: review.mentorId,
      mentorName: review.mentorName,
      feedback: review.feedback,
      rating: review.rating,
      status: review.status,
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const doc = await ProjectModel.findByIdAndUpdate(
          projectId,
          { $push: { reviews: newReview }, updatedAt: new Date() },
          { new: true }
        ).lean();
        if (doc) return doc as IProject;
      } catch {
        // Fall back to memory
      }
    }

    const proj = inMemoryProjects.find((p) => p._id === projectId);
    if (proj) {
      if (!proj.reviews) proj.reviews = [];
      proj.reviews.push(newReview);
      proj.updatedAt = new Date();
      return proj;
    }
    return null;
  },
};
