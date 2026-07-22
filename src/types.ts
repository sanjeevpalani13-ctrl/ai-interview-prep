export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type InterviewType = 'technical' | 'behavioral' | 'system-design' | 'culture-fit' | 'mixed';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type HiringRecommendation = 'Strong Hire' | 'Hire' | 'Weak Pass' | 'Needs Work';

export interface InterviewConfig {
  role: string;
  level: ExperienceLevel;
  type: InterviewType;
  skills: string[];
  questionCount: number;
  jobDescription?: string;
  resumeText?: string;
  companyName?: string;
  focusAreas?: string;
}

export interface Question {
  id: string;
  title: string;
  category: 'technical' | 'behavioral' | 'system-design' | 'culture-fit';
  difficulty: QuestionDifficulty;
  prompt: string;
  context?: string;
  keyTopicsToCover: string[];
  timeLimitMinutes: number;
  hints: string[];
  idealAnswerOutline: string;
}

export interface UserAnswer {
  questionId: string;
  answerText: string;
  timeTakenSeconds: number;
  hintsUsedCount: number;
  submittedAt: string;
}

export interface QuestionEvaluation {
  questionId: string;
  score: number; // 0 - 100
  clarityScore: number;
  technicalScore: number;
  completenessScore: number;
  starStructureScore?: number;
  strengths: string[];
  improvements: string[];
  missingKeyTopics: string[];
  detailedFeedback: string;
  modelAnswer: string;
  suggestedFollowUpQuestion?: string;
}

export interface SkillScore {
  skill: string;
  score: number;
  feedback: string;
}

export interface InterviewSession {
  id: string;
  createdAt: string;
  config: InterviewConfig;
  questions: Question[];
  answers: Record<string, UserAnswer>;
  evaluations: Record<string, QuestionEvaluation>;
  overallScore?: number;
  hiringRecommendation?: HiringRecommendation;
  summaryFeedback?: string;
  skillBreakdown?: SkillScore[];
  keyTakeaways?: string[];
  recommendedStudyTopics?: string[];
  isCompleted: boolean;
}

export interface STARStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
  createdAt: string;
}

export interface CheatSheetQuestion {
  question: string;
  category: string;
  keyPoints: string[];
  commonPitfalls: string[];
  idealAnswerSnippet: string;
}

export interface CheatSheet {
  role: string;
  overview: string;
  topQuestions: CheatSheetQuestion[];
  keyConcepts: { topic: string; explanation: string }[];
  behavioralTips: string[];
}
