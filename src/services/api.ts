import {
  InterviewConfig,
  Question,
  QuestionEvaluation,
  InterviewSession,
  CheatSheet,
  SkillScore,
  HiringRecommendation,
} from '../types';

export async function analyzeJDAndResume(
  jobDescription?: string,
  resumeText?: string
): Promise<{
  role: string;
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills: string[];
  focusAreas: string;
  companyName?: string;
}> {
  const res = await fetch('/api/analyze-jd-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription, resumeText }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze Job Description / Resume');
  }

  return res.json();
}

export async function generateInterviewQuestions(config: InterviewConfig): Promise<Question[]> {
  const res = await fetch('/api/generate-interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate interview questions');
  }

  const data = await res.json();
  return data.questions || [];
}

export async function evaluateAnswer(
  question: Question,
  answerText: string,
  timeTakenSeconds: number,
  config: InterviewConfig
): Promise<QuestionEvaluation> {
  const res = await fetch('/api/evaluate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answerText, timeTakenSeconds, config }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate answer');
  }

  return res.json();
}

export async function finalizeInterviewSession(
  config: InterviewConfig,
  questions: Question[],
  evaluations: Record<string, QuestionEvaluation>
): Promise<{
  overallScore: number;
  hiringRecommendation: HiringRecommendation;
  summaryFeedback: string;
  skillBreakdown: SkillScore[];
  keyTakeaways: string[];
  recommendedStudyTopics: string[];
}> {
  const res = await fetch('/api/finalize-interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ config, questions, evaluations }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to finalize interview report');
  }

  return res.json();
}

export async function generateCheatSheet(role: string, level?: string): Promise<CheatSheet> {
  const res = await fetch('/api/generate-cheatsheet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, level }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate prep cheat sheet');
  }

  return res.json();
}
