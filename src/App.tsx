import React, { useState, useEffect } from 'react';
import {
  InterviewConfig,
  Question,
  UserAnswer,
  QuestionEvaluation,
  InterviewSession,
} from './types';
import {
  generateInterviewQuestions,
  evaluateAnswer,
  finalizeInterviewSession,
} from './services/api';
import { saveSession, getSavedSessions } from './services/storage';
import { Header, AppTab } from './components/Header';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewSession as InterviewSessionComp } from './components/InterviewSession';
import { AnswerFeedbackModal } from './components/AnswerFeedbackModal';
import { InterviewReport } from './components/InterviewReport';
import { QuestionBank } from './components/QuestionBank';
import { StarBuilder } from './components/StarBuilder';
import { HistoryList } from './components/HistoryList';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('setup');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Session State
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showReportView, setShowReportView] = useState(false);

  // Feedback Modal State
  const [feedbackQuestion, setFeedbackQuestion] = useState<Question | null>(null);
  const [feedbackEval, setFeedbackEval] = useState<QuestionEvaluation | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Check if there is an active incomplete session
  useEffect(() => {
    const saved = getSavedSessions();
    const inProgress = saved.find((s) => !s.isCompleted);
    if (inProgress && !currentSession) {
      setCurrentSession(inProgress);
    }
  }, []);

  const handleStartInterview = async (config: InterviewConfig) => {
    setIsGenerating(true);
    try {
      const questions = await generateInterviewQuestions(config);
      if (!questions || questions.length === 0) {
        throw new Error('No questions returned for this configuration.');
      }

      const newSession: InterviewSession = {
        id: `session-${Date.now()}`,
        createdAt: new Date().toISOString(),
        config,
        questions,
        answers: {},
        evaluations: {},
        isCompleted: false,
      };

      setCurrentSession(newSession);
      setCurrentQuestionIndex(0);
      setShowReportView(false);
      saveSession(newSession);
    } catch (err: any) {
      alert('Error generating interview: ' + (err.message || 'Server error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async (
    question: Question,
    answerText: string,
    timeTakenSeconds: number,
    hintsUsedCount: number
  ) => {
    if (!currentSession) return;
    setIsEvaluating(true);

    try {
      const evaluation = await evaluateAnswer(
        question,
        answerText,
        timeTakenSeconds,
        currentSession.config
      );

      const userAnswer: UserAnswer = {
        questionId: question.id,
        answerText,
        timeTakenSeconds,
        hintsUsedCount,
        submittedAt: new Date().toISOString(),
      };

      const updatedAnswers = {
        ...currentSession.answers,
        [question.id]: userAnswer,
      };

      const updatedEvaluations = {
        ...currentSession.evaluations,
        [question.id]: evaluation,
      };

      const updatedSession: InterviewSession = {
        ...currentSession,
        answers: updatedAnswers,
        evaluations: updatedEvaluations,
      };

      setCurrentSession(updatedSession);
      saveSession(updatedSession);

      // Trigger Feedback Modal
      setFeedbackQuestion(question);
      setFeedbackEval(evaluation);
      setShowFeedbackModal(true);
    } catch (err: any) {
      alert('Evaluation error: ' + (err.message || 'Failed to evaluate answer'));
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFinishSession = async () => {
    if (!currentSession) return;

    if (Object.keys(currentSession.evaluations).length === 0) {
      alert('Please answer at least one question before viewing the final report.');
      return;
    }

    setIsFinalizing(true);
    try {
      const summary = await finalizeInterviewSession(
        currentSession.config,
        currentSession.questions,
        currentSession.evaluations
      );

      const finalizedSession: InterviewSession = {
        ...currentSession,
        overallScore: summary.overallScore,
        hiringRecommendation: summary.hiringRecommendation,
        summaryFeedback: summary.summaryFeedback,
        skillBreakdown: summary.skillBreakdown,
        keyTakeaways: summary.keyTakeaways,
        recommendedStudyTopics: summary.recommendedStudyTopics,
        isCompleted: true,
      };

      setCurrentSession(finalizedSession);
      saveSession(finalizedSession);
      setShowReportView(true);
    } catch (err: any) {
      console.error('Failed to finalize session summary:', err);
      // Fallback: show report view with individual scores even if summary call errors
      setShowReportView(true);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleSelectPastSession = (session: InterviewSession) => {
    setCurrentSession(session);
    if (session.isCompleted) {
      setShowReportView(true);
    } else {
      setShowReportView(false);
      // find first unanswered question index
      const unansweredIdx = session.questions.findIndex((q) => !session.evaluations[q.id]);
      setCurrentQuestionIndex(unansweredIdx >= 0 ? unansweredIdx : 0);
    }
    setActiveTab('setup');
  };

  const hasActiveSession = !!currentSession && !showReportView;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'setup') {
            setShowReportView(false);
          }
        }}
        hasActiveSession={hasActiveSession}
        onReturnToActiveSession={() => {
          setActiveTab('setup');
          setShowReportView(false);
        }}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'setup' && (
          <>
            {!currentSession ? (
              <InterviewSetup
                onStartInterview={handleStartInterview}
                isLoading={isGenerating}
              />
            ) : showReportView ? (
              <InterviewReport
                session={currentSession}
                onRestart={() => {
                  setCurrentSession(null);
                  setShowReportView(false);
                }}
              />
            ) : (
              <InterviewSessionComp
                config={currentSession.config}
                questions={currentSession.questions}
                currentQuestionIndex={currentQuestionIndex}
                onSelectQuestionIndex={setCurrentQuestionIndex}
                answers={currentSession.answers}
                evaluations={currentSession.evaluations}
                onSubmitAnswer={handleSubmitAnswer}
                onFinishSession={handleFinishSession}
                isEvaluating={isEvaluating}
                soundEnabled={soundEnabled}
              />
            )}
          </>
        )}

        {activeTab === 'cheatsheet' && <QuestionBank />}
        {activeTab === 'star' && <StarBuilder />}
        {activeTab === 'history' && (
          <HistoryList
            onSelectSession={handleSelectPastSession}
            onStartNew={() => {
              setCurrentSession(null);
              setShowReportView(false);
              setActiveTab('setup');
            }}
          />
        )}
      </main>

      {/* Answer Feedback Overlay Modal */}
      {showFeedbackModal && feedbackQuestion && feedbackEval && (
        <AnswerFeedbackModal
          question={feedbackQuestion}
          evaluation={feedbackEval}
          onClose={() => setShowFeedbackModal(false)}
          hasNextQuestion={currentQuestionIndex < (currentSession?.questions.length || 0) - 1}
          onNextQuestion={() => {
            setCurrentQuestionIndex((prev) => prev + 1);
          }}
        />
      )}
    </div>
  );
}
