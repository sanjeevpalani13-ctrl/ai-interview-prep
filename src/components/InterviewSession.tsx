import React, { useState, useEffect, useRef } from 'react';
import {
  Question,
  InterviewConfig,
  UserAnswer,
  QuestionEvaluation,
} from '../types';
import {
  Volume2,
  Mic,
  MicOff,
  Clock,
  HelpCircle,
  Send,
  Loader2,
  CheckCircle,
  Lightbulb,
  ChevronRight,
  Info,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface InterviewSessionProps {
  config: InterviewConfig;
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestionIndex: (index: number) => void;
  answers: Record<string, UserAnswer>;
  evaluations: Record<string, QuestionEvaluation>;
  onSubmitAnswer: (
    question: Question,
    answerText: string,
    timeTakenSeconds: number,
    hintsUsedCount: number
  ) => Promise<void>;
  onFinishSession: () => void;
  isEvaluating: boolean;
  soundEnabled: boolean;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({
  config,
  questions,
  currentQuestionIndex,
  onSelectQuestionIndex,
  answers,
  evaluations,
  onSubmitAnswer,
  onFinishSession,
  isEvaluating,
  soundEnabled,
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const existingAnswer = answers[currentQuestion?.id];
  const existingEval = evaluations[currentQuestion?.id];

  const [answerText, setAnswerText] = useState(existingAnswer?.answerText || '');
  const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(existingAnswer?.timeTakenSeconds || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(!existingEval);

  // Voice speech synthesis & recognition state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Sync state when current question changes
  useEffect(() => {
    if (currentQuestion) {
      setAnswerText(answers[currentQuestion.id]?.answerText || '');
      setHintsRevealed([]);
      setTimerSeconds(answers[currentQuestion.id]?.timeTakenSeconds || 0);
      setIsTimerRunning(!evaluations[currentQuestion.id]);

      // Speak question automatically if sound is enabled & not already answered
      if (soundEnabled && !evaluations[currentQuestion.id]) {
        speakPrompt(currentQuestion.prompt);
      }
    }
  }, [currentQuestionIndex, currentQuestion?.id]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !existingEval) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, existingEval]);

  // Speech Synthesis Helper
  const speakPrompt = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech Recognition Helper (Browser Speech-To-Text)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. You can type your answer directly.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setAnswerText((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start error:', err);
      setIsListening(false);
    }
  };

  const handleRevealHint = (index: number) => {
    if (!hintsRevealed.includes(index)) {
      setHintsRevealed([...hintsRevealed, index]);
    }
  };

  const handleSubmit = async () => {
    if (!answerText.trim()) {
      alert('Please enter or speak your answer before submitting.');
      return;
    }
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsTimerRunning(false);

    await onSubmitAnswer(currentQuestion, answerText, timerSeconds, hintsRevealed.length);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) return null;

  const totalAnswered = Object.keys(evaluations).length;
  const isAllAnswered = totalAnswered === questions.length;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Question Progress & Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 capitalize">
              {currentQuestion.category}
            </span>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question Dots Picker */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            {questions.map((q, idx) => {
              const isEvaluated = !!evaluations[q.id];
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestionIndex(idx)}
                  className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 shadow-xs'
                      : isEvaluated
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`Question ${idx + 1}`}
                >
                  {isEvaluated ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : idx + 1}
                </button>
              );
            })}
          </div>

          {/* Action to Finish Session */}
          <div>
            <button
              onClick={onFinishSession}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                isAllAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md animate-bounce'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isAllAnswered ? 'View Final Session Scorecard' : `Summary (${totalAnswered}/${questions.length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Question Prompt & AI Speech Reader */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {currentQuestion.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target Time: {currentQuestion.timeLimitMinutes} minutes
                </p>
              </div>

              <button
                onClick={() =>
                  isSpeaking ? stopSpeaking() : speakPrompt(currentQuestion.prompt)
                }
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSpeaking
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs animate-pulse'
                    : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-indigo-700'
                }`}
                title="Listen to question spoken by AI"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
              </button>
            </div>

            {/* Question Text Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed font-medium">
              {currentQuestion.prompt}
            </div>

            {currentQuestion.context && (
              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 text-xs">
                <span className="font-bold">Scenario Context: </span>
                {currentQuestion.context}
              </div>
            )}

            {/* Key Topics Expected Badges */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Expected Key Concepts To Address:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentQuestion.keyTopicsToCover.map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200"
                  >
                    • {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Hints Drawer */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Question Hints ({currentQuestion.hints.length})</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {hintsRevealed.length} revealed
                </span>
              </div>

              <div className="space-y-2">
                {currentQuestion.hints.map((hintText, hintIdx) => {
                  const isRevealed = hintsRevealed.includes(hintIdx);

                  return (
                    <div
                      key={hintIdx}
                      className="p-3 rounded-xl border border-slate-200 text-xs transition-all bg-slate-50"
                    >
                      {isRevealed ? (
                        <div className="text-slate-800 font-medium flex items-start space-x-2">
                          <span className="font-bold text-amber-600">
                            Hint {hintIdx + 1}:
                          </span>
                          <span>{hintText}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRevealHint(hintIdx)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          <span>Reveal Hint {hintIdx + 1}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STAR Method Guide Box for Behavioral Questions */}
          {currentQuestion.category === 'behavioral' && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/70 p-5 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  STAR Method Guidance
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-amber-950">
                <div className="p-2 bg-white/80 rounded-lg border border-amber-200/50">
                  <span className="font-bold text-amber-800">S - Situation: </span>
                  Set context & background.
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-amber-200/50">
                  <span className="font-bold text-amber-800">T - Task: </span>
                  Your core goal/responsibility.
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-amber-200/50">
                  <span className="font-bold text-amber-800">A - Action: </span>
                  Specific steps you took.
                </div>
                <div className="p-2 bg-white/80 rounded-lg border border-amber-200/50">
                  <span className="font-bold text-amber-800">R - Result: </span>
                  Quantifiable impact & learnings.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Answer Response Editor, Speech Input & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 flex flex-col justify-between h-full min-h-[460px]">
            <div className="space-y-3">
              {/* Timer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Elapsed Time:
                  </span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {formatTimer(timerSeconds)}
                  </span>
                </div>

                {!existingEval && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                      title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setTimerSeconds(0)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Answer Input Area Header with Speech Recognition Button */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <span>Your Answer Response</span>
                  {existingEval && (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Evaluated
                    </span>
                  )}
                </label>

                {!existingEval && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isListening
                        ? 'bg-rose-600 text-white animate-pulse shadow-xs'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                  </button>
                )}
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  rows={12}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your structured answer here, or click 'Voice Input' to speak your answer aloud..."
                  className="w-full p-4 text-xs sm:text-sm text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-sans leading-relaxed"
                  disabled={existingEval || isEvaluating}
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 px-1">
                  <span>
                    Words: {answerText.trim() ? answerText.trim().split(/\s+/).length : 0}
                  </span>
                  <span>
                    {existingEval
                      ? `Score: ${existingEval.score}%`
                      : 'Structured responses yield highest scores.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              {!existingEval ? (
                <button
                  id="btn-submit-answer"
                  onClick={handleSubmit}
                  disabled={isEvaluating || !answerText.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:bg-slate-300 disabled:shadow-none"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Assessing Answer...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Answer for AI Evaluation</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <span className="font-semibold">Answer evaluated!</span>
                    <span className="font-bold text-sm text-emerald-700">
                      {existingEval.score} / 100
                    </span>
                  </div>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => onSelectQuestionIndex(currentQuestionIndex + 1)}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Proceed to Question {currentQuestionIndex + 2}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={onFinishSession}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>View Full Session Hiring Report</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
