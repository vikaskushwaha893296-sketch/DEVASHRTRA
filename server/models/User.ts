import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { isMongoConnected } from '../db.ts';

export type UserRole = 'student' | 'parent' | 'mentor' | 'admin';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  studentDetails?: {
    xp: number;
    level: number;
    badges: { id: string; name: string; earnedAt: string; icon: string }[];
    currentStreak: number;
    enrolledBatches: { id: string; title: string; progress: number; mentor: string; nextLesson: string }[];
    parentId?: string;
  };
  parentDetails?: {
    childName: string;
    childAge: number;
    childEmail: string;
    allowedDailyMinutes: number;
    usedMinutesToday: number;
    modulesProgress: { moduleName: string; progress: number; status: 'completed' | 'in_progress' | 'locked' }[];
    copilotAuditLogs: {
      id: string;
      timestamp: string;
      question: string;
      copilotHint: string;
      safetyFlag: 'clean' | 'flagged';
    }[];
  };
  mentorDetails?: {
    expertise: string[];
    assignedBatches: { id: string; name: string; studentCount: number; nextOfficeHours: string }[];
    pendingSubmissions: { id: string; studentName: string; taskTitle: string; language: string; submittedAt: string }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'parent', 'mentor', 'admin'],
      default: 'student',
      required: true,
    },
    avatar: { type: String },
    bio: { type: String },
    studentDetails: {
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      badges: [{ id: String, name: String, earnedAt: String, icon: String }],
      currentStreak: { type: Number, default: 1 },
      enrolledBatches: [{ id: String, title: String, progress: Number, mentor: String, nextLesson: String }],
      parentId: { type: String },
    },
    parentDetails: {
      childName: { type: String, default: 'Aarav Chen' },
      childAge: { type: Number, default: 10 },
      childEmail: { type: String, default: 'student@devashtra.com' },
      allowedDailyMinutes: { type: Number, default: 45 },
      usedMinutesToday: { type: Number, default: 28 },
      modulesProgress: [{ moduleName: String, progress: Number, status: String }],
      copilotAuditLogs: [{ id: String, timestamp: String, question: String, copilotHint: String, safetyFlag: String }],
    },
    mentorDetails: {
      expertise: [{ type: String }],
      assignedBatches: [{ id: String, name: String, studentCount: Number, nextOfficeHours: String }],
      pendingSubmissions: [{ id: String, studentName: String, taskTitle: String, language: String, submittedAt: String }],
    },
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

// Synchronously hash default demo password "password123"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

// In-memory demo seed users
const memoryUsers: IUser[] = [
  {
    _id: 'usr-student-01',
    name: 'Aarav Chen',
    email: 'student@devashtra.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav',
    bio: 'Aspiring systems engineer & Python enthusiast',
    studentDetails: {
      xp: 1450,
      level: 4,
      currentStreak: 6,
      badges: [
        { id: 'b1', name: 'Async Pilot', earnedAt: 'Yesterday', icon: 'zap' },
        { id: 'b2', name: 'Cipher Guard', earnedAt: '3 days ago', icon: 'shield' },
        { id: 'b3', name: 'Memory Optimizer', earnedAt: 'Last week', icon: 'cpu' },
      ],
      enrolledBatches: [
        {
          id: 'batch-py-101',
          title: 'Algorithmic Systems in Python 3',
          progress: 68,
          mentor: 'Dr. Vikram Patel',
          nextLesson: 'Lesson 5: Heaps & Priority Queues in Cloud Load Balancing',
        },
        {
          id: 'batch-fullstack-201',
          title: 'Fullstack Execution & Express Sandboxes',
          progress: 42,
          mentor: 'Dr. Vikram Patel',
          nextLesson: 'Lesson 3: JWT Verification & Bearer Protocol',
        },
      ],
    },
    createdAt: new Date(Date.now() - 86400000 * 14),
    updatedAt: new Date(),
  },
  {
    _id: 'usr-parent-01',
    name: 'Sarah Chen',
    email: 'parent@devashtra.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'parent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen',
    bio: 'Parent of Aarav Chen (Devashtra Junior student)',
    parentDetails: {
      childName: 'Aarav Chen',
      childAge: 10,
      childEmail: 'student@devashtra.com',
      allowedDailyMinutes: 45,
      usedMinutesToday: 28,
      modulesProgress: [
        { moduleName: 'Module 1: Space Rover Logic & Loops', progress: 100, status: 'completed' },
        { moduleName: 'Module 2: Secret Ciphers & Cyber-Safety', progress: 75, status: 'in_progress' },
        { moduleName: 'Module 3: AI Mini-Companion Training', progress: 20, status: 'in_progress' },
        { moduleName: 'Module 4: Web Space Station Mission', progress: 0, status: 'locked' },
      ],
      copilotAuditLogs: [
        {
          id: 'log-1',
          timestamp: 'Today at 4:18 PM',
          question: 'Why did my rover turn left twice instead of going forward?',
          copilotHint: 'Check line 6 inside your while loop! You have rover.turn_left() inside the loop block. What happens if you move it outside after the distance check?',
          safetyFlag: 'clean',
        },
        {
          id: 'log-2',
          timestamp: 'Yesterday at 5:02 PM',
          question: 'What is a Caesar cipher shift key?',
          copilotHint: 'Think of the alphabet as a circular dial with 26 letters! A shift of 3 turns A into D. Try shifting B by 3!',
          safetyFlag: 'clean',
        },
        {
          id: 'log-3',
          timestamp: 'Oct 30 at 3:45 PM',
          question: 'Can I write infinite loops in Python?',
          copilotHint: 'Yes with while True, but real rovers need a stopping condition like battery > 0 or distance > 0!',
          safetyFlag: 'clean',
        },
      ],
    },
    createdAt: new Date(Date.now() - 86400000 * 20),
    updatedAt: new Date(),
  },
  {
    _id: 'usr-mentor-01',
    name: 'Dr. Vikram Patel',
    email: 'mentor@devashtra.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'mentor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VikramPatel',
    bio: 'Principal Distributed Systems Engineer & Cohort Mentor',
    mentorDetails: {
      expertise: ['Python', 'Distributed Systems', 'Node.js', 'System Architecture'],
      assignedBatches: [
        { id: 'batch-py-101', name: 'Algorithmic Systems in Python 3', studentCount: 28, nextOfficeHours: 'Tomorrow at 6:00 PM IST' },
        { id: 'batch-fullstack-201', name: 'Fullstack Execution & Express Sandboxes', studentCount: 34, nextOfficeHours: 'Friday at 7:30 PM IST' },
      ],
      pendingSubmissions: [
        { id: 'sub-101', studentName: 'Aarav Chen', taskTitle: 'Heap-based Cluster Allocator', language: 'python', submittedAt: '2 hours ago' },
        { id: 'sub-102', studentName: 'Priya Verma', taskTitle: 'JWT Authorization Middleware', language: 'javascript', submittedAt: '4 hours ago' },
        { id: 'sub-103', studentName: 'Liam Davis', taskTitle: 'Binary Search Tree Balancing', language: 'python', submittedAt: '1 day ago' },
      ],
    },
    createdAt: new Date(Date.now() - 86400000 * 30),
    updatedAt: new Date(),
  },
  {
    _id: 'usr-admin-01',
    name: 'Devashtra Operations Admin',
    email: 'admin@devashtra.com',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDevashtra',
    bio: 'Root Platform Administrator',
    createdAt: new Date(Date.now() - 86400000 * 60),
    updatedAt: new Date(),
  },
];

export const UserRepository = {
  async findByEmail(email: string): Promise<IUser | null> {
    const normalized = email.trim().toLowerCase();
    if (isMongoConnected()) {
      const user = await UserModel.findOne({ email: normalized }).lean();
      return user as IUser | null;
    }
    const found = memoryUsers.find((u) => u.email.toLowerCase() === normalized);
    return found ? { ...found } : null;
  },

  async findById(id: string): Promise<IUser | null> {
    if (isMongoConnected()) {
      const user = await UserModel.findById(id).lean();
      return user as IUser | null;
    }
    const found = memoryUsers.find((u) => u._id === id);
    return found ? { ...found } : null;
  },

  async create(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<IUser> {
    const normalized = userData.email.trim().toLowerCase();
    const existing = await this.findByEmail(normalized);
    if (existing) {
      throw new Error('A user account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    if (isMongoConnected()) {
      const created = await UserModel.create({
        name: userData.name.trim(),
        email: normalized,
        passwordHash,
        role: userData.role,
        studentDetails:
          userData.role === 'student'
            ? {
                xp: 100,
                level: 1,
                currentStreak: 1,
                badges: [{ id: 'b-init', name: 'Devashtra Initiate', earnedAt: 'Today', icon: 'code' }],
                enrolledBatches: [
                  {
                    id: 'batch-py-101',
                    title: 'Algorithmic Systems in Python 3',
                    progress: 10,
                    mentor: 'Dr. Vikram Patel',
                    nextLesson: 'Lesson 1: Zero-Install Cloud Lab Basics',
                  },
                ],
              }
            : undefined,
        parentDetails:
          userData.role === 'parent'
            ? {
                childName: 'Young Learner',
                childAge: 9,
                childEmail: 'child@example.com',
                allowedDailyMinutes: 45,
                usedMinutesToday: 0,
                modulesProgress: [
                  { moduleName: 'Module 1: Space Rover Logic', progress: 15, status: 'in_progress' },
                ],
                copilotAuditLogs: [],
              }
            : undefined,
        mentorDetails:
          userData.role === 'mentor'
            ? {
                expertise: ['Python', 'Fullstack'],
                assignedBatches: [{ id: 'batch-py-101', name: 'Algorithmic Systems in Python 3', studentCount: 15, nextOfficeHours: 'Friday at 6 PM' }],
                pendingSubmissions: [],
              }
            : undefined,
      });
      return created.toObject();
    } else {
      const newUser: IUser = {
        _id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name: userData.name.trim(),
        email: normalized,
        passwordHash,
        role: userData.role,
        studentDetails:
          userData.role === 'student'
            ? {
                xp: 100,
                level: 1,
                currentStreak: 1,
                badges: [{ id: 'b-init', name: 'Devashtra Initiate', earnedAt: 'Today', icon: 'code' }],
                enrolledBatches: [
                  {
                    id: 'batch-py-101',
                    title: 'Algorithmic Systems in Python 3',
                    progress: 10,
                    mentor: 'Dr. Vikram Patel',
                    nextLesson: 'Lesson 1: Zero-Install Cloud Lab Basics',
                  },
                ],
              }
            : undefined,
        parentDetails:
          userData.role === 'parent'
            ? {
                childName: 'Young Learner',
                childAge: 9,
                childEmail: 'child@example.com',
                allowedDailyMinutes: 45,
                usedMinutesToday: 0,
                modulesProgress: [
                  { moduleName: 'Module 1: Space Rover Logic', progress: 15, status: 'in_progress' },
                ],
                copilotAuditLogs: [],
              }
            : undefined,
        mentorDetails:
          userData.role === 'mentor'
            ? {
                expertise: ['Python', 'Fullstack'],
                assignedBatches: [{ id: 'batch-py-101', name: 'Algorithmic Systems in Python 3', studentCount: 15, nextOfficeHours: 'Friday at 6 PM' }],
                pendingSubmissions: [],
              }
            : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryUsers.push(newUser);
      return { ...newUser };
    }
  },

  async verifyPassword(user: IUser, plain: string): Promise<boolean> {
    return bcrypt.compare(plain, user.passwordHash);
  },

  async getAllUsers(): Promise<Omit<IUser, 'passwordHash'>[]> {
    if (isMongoConnected()) {
      return UserModel.find({}, '-passwordHash').sort({ createdAt: -1 }).lean();
    }
    return memoryUsers.map(({ passwordHash: _, ...rest }) => rest);
  },

  async updateParentScreenTime(userId: string, minutes: number): Promise<boolean> {
    if (isMongoConnected()) {
      await UserModel.findByIdAndUpdate(userId, { 'parentDetails.allowedDailyMinutes': minutes });
      return true;
    }
    const user = memoryUsers.find((u) => u._id === userId);
    if (user && user.parentDetails) {
      user.parentDetails.allowedDailyMinutes = minutes;
      return true;
    }
    return false;
  },

  async updateStudentXP(userId: string, xp: number): Promise<boolean> {
    const level = Math.floor(xp / 250) + 1;
    if (isMongoConnected()) {
      await UserModel.findByIdAndUpdate(userId, {
        'studentDetails.xp': xp,
        'studentDetails.level': level,
      });
      return true;
    }
    const user = memoryUsers.find((u) => u._id === userId);
    if (user && user.studentDetails) {
      user.studentDetails.xp = xp;
      user.studentDetails.level = level;
      return true;
    }
    return false;
  },
};
