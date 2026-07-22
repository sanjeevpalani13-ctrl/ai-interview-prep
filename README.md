# 🎯 AI Interview Generator PRO

An intelligent, full-stack AI-powered mock interview practice platform designed to prepare candidates for technical, behavioral, and leadership interviews. Built with **React**, **TypeScript**, **Express**, **Tailwind CSS**, and powered by Google's **Gemini 2.5 Flash** models via `@google/genai`.

---

## ✨ Features

- **💼 Role & Level Customization**: Generate realistic questions for any target position (e.g., Senior Frontend Engineer, Staff Backend Architect, Machine Learning Specialist, Product Manager) across entry, mid, senior, lead, and executive experience levels.
- **📄 Smart Job Description & Resume Parser**: Paste target Job Descriptions or candidate Resumes to automatically extract key skills, focus areas, target company names, and seniority levels.
- **🎙️ Speech & Voice Interactive Simulator**:
  - Integrated text-to-speech for AI question voice narration.
  - Browser speech-to-text voice input for practicing spoken answers in real-time.
- **⚡ Real-Time AI Answer Evaluation**: Get instant, structured evaluation on every response, including:
  - **Overall Score** (0 - 100%)
  - **Clarity, Technical Depth & Completeness Metrics**
  - **Key Strengths & Concrete Areas for Improvement**
  - **Missing Key Topics & Expected Concepts**
  - **Gold Standard Exemplar Model Answers**
  - **Interviewer Follow-up Questions**
- **📊 Comprehensive Hiring Scorecard**: At the end of the session, synthesize an executive summary report with overall hiring recommendations (*Strong Hire*, *Hire*, *Weak Pass*, *Needs Work*), skill matrix breakdowns, and an actionable study plan.
- **⭐ STAR Story Builder & Vault**: A dedicated workshop to draft, refine, tag, and organize Situation-Task-Action-Result (STAR) behavioral stories.
- **📚 Role Cheat Sheet Flashcards**: Generate rapid revision guides with high-frequency questions, model answer snippets, pitfall warnings, and core concepts to master.
- **📜 Session History & Archive**: Automatically saves completed and in-progress mock interview sessions in local storage for continuous review.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React Icons
- **Backend API**: Express v4 server (`server.ts`) with Vite SSR/middleware integration
- **AI Engine**: Google `@google/genai` SDK using `gemini-2.5-flash` with structured JSON output schemas
- **Voice/Speech**: Native Browser Web Speech APIs (`SpeechSynthesis` & `webkitSpeechRecognition`)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Gemini API Key**: Set your `GEMINI_API_KEY` environment variable in `.env`.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Setup:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   PORT=3000
   ```

3. Run in Development Mode:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Production Build & Execution:
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Project Structure

```
├── server.ts                   # Express server & Gemini AI API endpoints
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Top navigation & session bar
│   │   ├── InterviewSetup.tsx  # Interview config & JD/Resume parser
│   │   ├── InterviewSession.tsx# Active simulator with timer & voice input
│   │   ├── AnswerFeedbackModal.tsx # Detailed answer score & model answer
│   │   ├── InterviewReport.tsx # Final scorecard & hiring recommendation
│   │   ├── QuestionBank.tsx    # Role prep cheat sheets
│   │   ├── StarBuilder.tsx     # STAR story workshop
│   │   └── HistoryList.tsx     # Session history archive
│   ├── services/
│   │   ├── api.ts              # Client API fetchers
│   │   └── storage.ts          # LocalStorage persistence helpers
│   ├── types.ts                # Shared TypeScript definitions
│   ├── App.tsx                 # Main application state router
│   ├── index.css               # Global Tailwind CSS imports
│   └── main.tsx                # React entry point
└── package.json
```

---

## 📄 License

Apache 2.0 License.
