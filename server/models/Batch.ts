import mongoose, { Schema, Document } from 'mongoose';
import { isMongoConnected } from '../db.ts';

export interface ILesson {
  id: string;
  title: string;
  description: string;
  language: 'python' | 'javascript';
  starterCode: string;
  solutionCode?: string;
  hints: string[];
  xpReward: number;
  testCases?: Array<{ name: string; expectedKeyword: string; expected: string }>;
}

export interface IBatch {
  _id?: string;
  title: string;
  code: string;
  category: 'core' | 'junior' | 'advanced' | 'ai';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructorName: string;
  instructorTitle: string;
  durationWeeks: number;
  lessons: ILesson[];
  enrolledStudentsCount: number;
  schedule: string;
  bannerGradient: string;
  createdAt: Date;
}

export interface IBatchDocument extends Omit<IBatch, '_id'>, Document {}

const LessonSchema = new Schema<ILesson>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, enum: ['python', 'javascript'], default: 'python' },
  starterCode: { type: String, required: true },
  solutionCode: { type: String },
  hints: [{ type: String }],
  xpReward: { type: Number, default: 50 },
});

const BatchSchema = new Schema<IBatchDocument>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true },
    category: { type: String, enum: ['core', 'junior', 'advanced', 'ai'], default: 'core' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    description: { type: String, required: true },
    instructorName: { type: String, default: 'Devashtra Mentor Team' },
    instructorTitle: { type: String, default: 'Senior Software Engineer' },
    durationWeeks: { type: Number, default: 6 },
    lessons: [LessonSchema],
    enrolledStudentsCount: { type: Number, default: 28 },
    schedule: { type: String, default: 'Mon & Wed • 6:00 PM IST' },
    bannerGradient: { type: String, default: 'from-cyan-900/40 via-teal-900/20 to-slate-900' },
  },
  { timestamps: true }
);

export const BatchModel =
  mongoose.models.Batch || mongoose.model<IBatchDocument>('Batch', BatchSchema);

// Initial curated curriculum
const initialBatches: IBatch[] = [
  {
    _id: 'batch-1',
    title: 'Python Core & Algorithmic Thinking',
    code: 'PY-101',
    category: 'core',
    level: 'Beginner',
    description: 'Master pure algorithmic logic, flow control, and data structures with live sandbox executions.',
    instructorName: 'Dr. Vikram Sen',
    instructorTitle: 'Principal Architect & AI Researcher',
    durationWeeks: 6,
    enrolledStudentsCount: 42,
    schedule: 'Mon & Thu • 7:00 PM IST',
    bannerGradient: 'from-cyan-950 via-teal-950/50 to-slate-900',
    createdAt: new Date(),
    lessons: [
      {
        id: 'lesson-py-1',
        title: 'Variables, Types & Formatted Outputs',
        description: 'Understand string interpolation, numbers, and basic data types. Build your first interactive CLI card.',
        language: 'python',
        starterCode: `# Lesson 1: Formatted Strings and Variables
student_name = "Devashtra Explorer"
level = 1
xp = 120

# Task: Print a formatted profile line
# Output should look like: [Level 1] Devashtra Explorer has 120 XP
print(f"[{'Level ' + str(level)}] {student_name} has {xp} XP")
`,
        hints: [
          'Use Python f-strings: f"{variable_name}"',
          'Ensure the string begins with an f before the quotes',
        ],
        xpReward: 50,
      },
      {
        id: 'lesson-py-2',
        title: 'Lists, Iteration & Accumulator Patterns',
        description: 'Iterate over collections, compute running sums, and filter elements efficiently.',
        language: 'python',
        starterCode: `# Lesson 2: Accumulator Pattern with Lists
scores = [85, 92, 78, 96, 88]

# Task: Calculate total score and average without using sum()
total = 0
for score in scores:
    total = total + score

average = total / len(scores)
print(f"Total: {total}, Average: {average:.1f}")
`,
        hints: [
          'Initialize your accumulator variable to 0 before the loop',
          'Use len(scores) to determine total count',
        ],
        xpReward: 60,
      },
      {
        id: 'lesson-py-3',
        title: 'Algorithmic Binary Search',
        description: 'Implement O(log n) binary search to find values inside sorted arrays in record time.',
        language: 'python',
        starterCode: `# Lesson 3: Binary Search Implementation
def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
index = binary_search(numbers, target)
print(f"Target {target} located at index: {index}")
`,
        hints: [
          'Keep left and right indices updated at each division step',
          'Use integer division // for array index calculation',
        ],
        xpReward: 80,
      },
    ],
  },
  {
    _id: 'batch-2',
    title: 'Devashtra Junior: Cyber Defender',
    code: 'JR-201',
    category: 'junior',
    level: 'Beginner',
    description: 'Gamified missions for young creators (ages 6–12). Learn cryptographic secrets, safety bots, and logic puzzles.',
    instructorName: 'Maya Patel',
    instructorTitle: 'STEM & Robotics Educator',
    durationWeeks: 4,
    enrolledStudentsCount: 35,
    schedule: 'Sat & Sun • 11:00 AM IST',
    bannerGradient: 'from-amber-950 via-orange-950/40 to-slate-900',
    createdAt: new Date(),
    lessons: [
      {
        id: 'lesson-jr-1',
        title: 'Secret Agent Caesar Cipher',
        description: 'Encode secret messages to outsmart digital snoops and protect your secret base.',
        language: 'javascript',
        starterCode: `// Mission 1: Secret Agent Cipher
function scrambleMessage(message, shift = 2) {
  let result = "";
  for (let i = 0; i < message.length; i++) {
    result += String.fromCharCode(message.charCodeAt(i) + shift);
  }
  return result;
}

const secret = "MISSION-ACCOMPLISHED";
console.log("Encrypted code: " + scrambleMessage(secret, 3));
`,
        hints: ['Try changing shift to 3 or 5 to see different scrambles', 'String.fromCharCode shifts the character code!'],
        xpReward: 75,
      },
      {
        id: 'lesson-jr-2',
        title: 'Rover Path Finder',
        description: 'Program the 3D Rover navigation sequence to evade laser obstacles and collect energy cores.',
        language: 'javascript',
        starterCode: `// Mission 2: Rover Navigator
const directions = ["FORWARD", "RIGHT", "FORWARD", "COLLECT_CORE", "LEFT", "FORWARD"];

console.log("Executing Rover sequence:");
directions.forEach((cmd, step) => {
  console.log(\`Step \${step + 1}: \${cmd}\`);
});
`,
        hints: ['Ensure each command is in uppercase', 'Check that the Rover collects the core at step 4'],
        xpReward: 85,
      },
    ],
  },
  {
    _id: 'batch-3',
    title: 'Biocomputing & Structural Proteomics',
    code: 'BIO-301',
    category: 'advanced',
    level: 'Advanced',
    description: 'Explore UniProt protein sequences, AlphaFold prediction coordinates, and computational genomics pipelines.',
    instructorName: 'Dr. Ananya Roy',
    instructorTitle: 'Computational Biologist',
    durationWeeks: 8,
    enrolledStudentsCount: 19,
    schedule: 'Tue & Fri • 8:00 PM IST',
    bannerGradient: 'from-emerald-950 via-teal-950/40 to-slate-900',
    createdAt: new Date(),
    lessons: [
      {
        id: 'lesson-bio-1',
        title: 'Parsing FASTA Sequences & GC Content',
        description: 'Calculate GC-content percentage from genomic strings to evaluate DNA thermal stability.',
        language: 'python',
        starterCode: `# Computational Biology: GC-Content Calculator
dna_sequence = "ATGCGATCGATCGATCGAATCGATCGATCGATCGATCGATCGAATCG"

g_count = dna_sequence.count('G')
c_count = dna_sequence.count('C')
gc_content = ((g_count + c_count) / len(dna_sequence)) * 100

print(f"Sequence length: {len(dna_sequence)} bp")
print(f"GC-Content: {gc_content:.2f}%")
`,
        hints: [
          'Use .count("G") and .count("C")',
          'Formula: (G + C) / total_length * 100',
        ],
        xpReward: 90,
      },
    ],
  },
];

let inMemoryBatches = [...initialBatches];

export const batchStore = {
  async getAll(): Promise<IBatch[]> {
    if (isMongoConnected()) {
      try {
        const docs = await BatchModel.find().lean();
        if (docs && docs.length > 0) return docs as IBatch[];
      } catch {
        // Fall back
      }
    }
    return inMemoryBatches;
  },

  async getById(id: string): Promise<IBatch | null> {
    if (isMongoConnected()) {
      try {
        const doc = await BatchModel.findById(id).lean();
        if (doc) return doc as IBatch;
      } catch {
        // Fall back
      }
    }
    return inMemoryBatches.find((b) => b._id === id || b.code === id) || null;
  },

  async create(data: Partial<IBatch>): Promise<IBatch> {
    const newBatch: IBatch = {
      _id: 'batch-' + Date.now().toString(36),
      title: data.title || 'New Batch',
      code: data.code || 'BATCH-' + Math.floor(Math.random() * 900 + 100),
      category: data.category || 'core',
      level: data.level || 'Beginner',
      description: data.description || '',
      instructorName: data.instructorName || 'Devashtra Mentor',
      instructorTitle: data.instructorTitle || 'Software Engineer',
      durationWeeks: data.durationWeeks || 6,
      lessons: data.lessons || [],
      enrolledStudentsCount: 0,
      schedule: data.schedule || 'Weekdays 7:00 PM IST',
      bannerGradient: 'from-cyan-950 via-teal-950/40 to-slate-900',
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const doc = await BatchModel.create(newBatch);
        return doc.toObject();
      } catch {
        // Fall back
      }
    }

    inMemoryBatches.push(newBatch);
    return newBatch;
  },
};
