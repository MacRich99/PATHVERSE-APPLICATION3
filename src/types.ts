export type CurrentStage = 'Exploring' | 'High School' | 'University' | 'Working' | 'Changing direction';

export type UserStageLevel = 'Explorer' | 'Learner' | 'Builder' | 'Specialist' | 'Professional' | 'Master' | 'Mentor';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'Compass' | 'Sparkles' | 'Rocket' | 'CheckCircle2' | 'Globe' | 'Award';
  unlockedAt?: string;
  unlocked: boolean;
  category: 'onboarding' | 'discovery' | 'project' | 'navigation' | 'community';
}

export type ResourceStatus = 'not_started' | 'opened' | 'completed' | 'verified' | 'mastered';

export interface StepResource {
  id: string;
  stepId: string;
  title: string;
  type: 'video' | 'article' | 'documentation' | 'interactive' | 'exercise';
  url: string;
  providerName: string;
  estimatedMinutes: number;
  status: ResourceStatus;
  openedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  quizScore?: number;
  verificationType?: 'self_confirm' | 'quiz' | 'project';
  articleContent?: {
    summary: string;
    keyTakeaways: string[];
    fullArticleText: string;
    caseStudyTitle?: string;
    caseStudyText?: string;
  };
}

export interface VerificationQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticalChallenge {
  title: string;
  description: string;
  starterInstructions: string;
  evaluationCriteria?: string[];
}

export interface StepAssessment {
  stepId: string;
  stepTitle: string;
  questions: VerificationQuizQuestion[];
  practicalChallenge?: PracticalChallenge;
}

export interface ProjectSubmission {
  stepId: string;
  projectTitle: string;
  submissionText: string;
  scorePercentage: number;
  isPassed: boolean;
  feedback: string;
  strengths?: string[];
  improvements?: string[];
  submittedAt: string;
}

export interface PathverseNotification {
  id: string;
  type: 'morning' | 'inactive' | 'completion' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  avatarUrl?: string; // Custom uploaded profile picture data URL
  age: number;
  country: string;
  stage: CurrentStage;
  interests: string[];
  enjoyText: string;
  futureGoals: string;
  hasCompletedOnboarding: boolean;
  hasCompletedQuiz?: boolean;
  diagnosticScores?: Record<string, number>;
  diagnosticStrengths?: string[];
  stageLevel: UserStageLevel;
  unlockedPathIds: string[]; // Paths unlocked via payment
  unlockedAchievementIds?: string[]; // IDs of unlocked badges
  activePathId?: string;
  yearBadge?: string; // e.g. "Class of 2026" or "2026 Cohort"
  fieldOfStudy?: string; // e.g. "Tech & AI", "Healthcare & Nursing", "Business & Finance", etc.
  createdAt: string;

  // Saved Activity State (Resume where left off)
  lastActiveTab?: string;
  lastActiveTimestamp?: string;

  // Closed Loop Progress Engine (#16-#21)
  openedResourceIds?: string[];
  completedResourceIds?: string[]; // User-reported completion
  verifiedStepIds?: string[]; // Passed verification quiz or project
  masteredStepIds?: string[]; // Passed with 100% or completed project
  assessmentScores?: Record<string, number>; // stepId -> percentage
  learningStreakDays?: number;
  lastActiveDate?: string;
  notificationsEnabled?: boolean;
  notifications?: PathverseNotification[];
}

export interface DiscoveredPath {
  id: string;
  title: string;
  reason: string;
  beginnerSkills: string[];
  isUnlocked?: boolean;
}

export interface DiscoveryResult {
  growthStageDescription: string;
  strengths: string[];
  paths: DiscoveredPath[];
  generatedAt: string;
}

export interface LifeGpsStep {
  id: string;
  order: number;
  title: string;
  description: string;
  phase: string; // e.g. "Foundations", "Skill Building", "Practical Projects", "Career Launch"
  estimatedTime: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  keySkills: string[];
}

export interface RecommendedProject {
  id: string;
  name: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isStarted: boolean;
  startedAt?: string;
}

export interface PathJourney {
  pathId: string;
  pathTitle: string;
  steps: LifeGpsStep[];
  recommendedProject: RecommendedProject;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  pathId: string;
  pathTitle: string;
  amount: number; // e.g. 4.99 or 0 for free mode
  currency: string;
  paymentMethod?: 'card' | 'data_bundle' | 'free_mode_sponsored';
  bundleDetails?: {
    provider: string;
    phoneOrPin: string;
    bundleMb: number;
  };
  timestamp: string;
  status: 'completed' | 'refunded';
}

export interface LearnerUser {
  id: string;
  firstName: string;
  country: string;
  stageLevel: UserStageLevel;
  chosenPath: string;
  avatarColor: string;
  kudosCount: number;
  yearBadge?: string; // e.g. "Class of 2026"
  fieldOfStudy?: string; // e.g. "Tech & AI", "Healthcare & Nursing", "Business & Finance", etc.
}

export interface YearBadgeCohort {
  id: string;
  year: string; // e.g. "2026"
  badgeTitle: string; // e.g. "Class of 2026 Badge"
  fieldOfStudy: string; // e.g. "Tech & AI", "Healthcare & Nursing", "All Fields", etc.
  memberCount: number;
  description: string;
  iconName: string;
  skillsInFocus: string[];
}

export interface CourseExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  explanation: string;
}

export interface CourseQuiz {
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseBadge {
  id: string;
  badgeName: string;
  description: string;
  skillsMastered: string[];
  issueDate?: string;
}

export interface CourseLesson {
  lessonNumber: number;
  title: string;
  duration: string;
  keyConcepts: string[];
  explanation: string;
  codeExample: string;
  practiceExercise: string;
  quiz: CourseQuiz;
}

export interface CourseModule {
  moduleNumber: number;
  title: string;
  summary: string;
  lessons: CourseLesson[];
}

export interface CourseOutlineData {
  title: string;
  topic: string;
  description: string;
  level: string;
  estimatedDuration: string;
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
  examples?: CourseExample[]; // Array of 5 detailed practical examples
  quizzes?: CourseQuiz[]; // Array of 5 comprehensive course quizzes
  workplaceStarterCode?: string; // Live demonstration playground code
  badge?: CourseBadge; // Accomplishment badge metadata
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorAvatarUrl?: string;
  authorRole?: 'user' | 'admin';
  authorYearBadge?: string;
  authorFieldOfStudy?: string;
  content: string;
  imageUrl?: string;
  category: 'Project Share' | 'Milestone' | 'Question' | 'Discussion';
  likesCount: number;
  likedByEmails: string[];
  comments: CommunityComment[];
  createdAt: string;
}

