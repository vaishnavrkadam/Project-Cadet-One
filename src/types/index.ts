export type UserRole = 'ANO' | 'Cadet' | 'Senior' | 'Unauthorized';

export interface CadetProfile {
  id: string; // Firestore doc id (usually auto or cadet email slug)
  fullName: string;
  email: string;
  regimentalNumber: string; // e.g. KA/22/SDA/123456
  rank: string; // Cadet, Lance Corporal, Corporal, Sergeant, Under Officer, Senior Under Officer
  unit: string; // e.g. 1 KAR BN NCC
  institution: string; // e.g. RVCE
  yearBatch: string; // 2024-2027
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Passed Out';
  role: 'Cadet' | 'Senior';
  companyId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  authorName: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  targetAudience: 'All' | '1st Year' | '2nd Year' | '3rd Year' | 'Camp Selects';
  date: string;
  archived?: boolean;
}

export interface AttendanceRecord {
  id: string; // doc id: YYYY-MM-DD-sessionKey
  date: string; // YYYY-MM-DD
  sessionType: string; // 'Parade', 'Weapon Drill', 'Theory Class', 'Physical Training', 'Special Parade'
  notes?: string;
  presentCadetIds: string[]; // List of Cadet doc IDs or emails
  totalCadets: number;
  markedBy: string;
  createdAt: string;
}

export interface TrainingResource {
  id: string;
  title: string;
  description: string;
  category: 'Selective Camps' | 'Weapon Training' | 'B Certificate' | 'C Certificate' | 'SSB Preparation';
  campTag?: 'TSC' | 'RDC' | 'IDSSC' | 'General';
  type: 'PDF' | 'Video' | 'Guide' | 'Question Bank';
  url: string; // Google Drive or YouTube embed URL
  fileSizeOrDuration?: string;
  updatedDate: string;
  addedBy: string;
}

export interface CadetProgress {
  cadetId: string;
  weaponTraining: {
    familiarisationPercent: number;
    partsAndFunctionsPercent: number;
    safetyProceduresPercent: number;
    liveFirePracticePercent: number;
    currentHandlingStep: number; // 1: Check Weapon, 2: Load Mag, 3: Insert Mag, 4: Chamber, 5: Ready
    overallPercent: number;
    lastSessionDate?: string;
    accuracyPercent?: number;
    hits?: number;
    misses?: number;
  };
  examPreparation: {
    testsAttempted: number;
    overallScorePercent: number;
    bestScorePercent: number;
    totalTimeSpentMinutes: number;
    subjectPerformance: {
      history: number;
      geography: number;
      nationalIntegration: number;
      armedForces: number;
      generalKnowledge: number;
    };
  };
  campPreparation: {
    selectedCamps: string[];
    rdcStage?: string;
    tscStage?: string;
  };
}

export interface ExamQuestion {
  id: string;
  subject: 'History' | 'Geography' | 'National Integration' | 'Armed Forces' | 'General Knowledge';
  certificate: 'B' | 'C' | 'Both';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExamAttempt {
  id: string;
  cadetEmail: string;
  examType: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string;
  subjectBreakdown: Record<string, number>;
}
