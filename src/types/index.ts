export type UserRole = 'student' | 'parent' | 'mentor' | 'admin' | 'educator' | 'other';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'curious_child';

export interface WaitlistFormData {
  fullName: string;
  email: string;
  role: UserRole;
  experienceLevel: ExperienceLevel;
  interestTrack: string;
  studentAge?: number;
  notes?: string;
}

export interface WaitlistEntry {
  email: string;
  fullName: string;
  role: UserRole;
  experienceLevel: ExperienceLevel;
  interestTrack: string;
  studentAge?: number;
  notes?: string;
  status: 'pending' | 'invited' | 'admitted';
  createdAt: string;
}

export interface WaitlistStats {
  total: number;
  roleBreakdown: Record<string, number>;
  trackBreakdown: Record<string, number>;
  isMongoBacked: boolean;
}

export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'mentor' | 'admin';
  avatar?: string;
  bio?: string;
  studentDetails?: {
    xp: number;
    level: number;
    badges: { id: string; name: string; earnedAt: string; icon: string }[];
    currentStreak: number;
    enrolledBatches: { id: string; title: string; progress: number; mentor: string; nextLesson: string }[];
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
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserProfile;
  error?: string;
}
