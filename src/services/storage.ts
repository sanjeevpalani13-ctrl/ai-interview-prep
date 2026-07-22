import { InterviewSession, STARStory } from '../types';

const STORAGE_KEY_SESSIONS = 'ai_interview_generator_sessions';
const STORAGE_KEY_STAR_STORIES = 'ai_interview_generator_star_stories';

export function getSavedSessions(): InterviewSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse saved sessions from localStorage:', err);
    return [];
  }
}

export function saveSession(session: InterviewSession): void {
  try {
    const sessions = getSavedSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save session to localStorage:', err);
  }
}

export function deleteSession(sessionId: string): void {
  try {
    const sessions = getSavedSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to delete session from localStorage:', err);
  }
}

export function getSTARStories(): STARStory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STAR_STORIES);
    if (raw) return JSON.parse(raw);
    // Return sample starter stories if empty
    return [
      {
        id: 'star-1',
        title: 'Optimizing Legacy API Latency by 65%',
        situation: 'During peak traffic, our core checkout API response times degraded to 1.8s causing drop-offs.',
        task: 'Identify database bottlenecks and refactor the slow ORM queries under strict deadline.',
        action: 'Analyzed query execution plans, implemented Redis caching, and indexed key join tables.',
        result: 'Reduced p99 latency to 280ms and increased overall checkout conversion rate by 4.2%.',
        tags: ['Performance', 'Backend', 'Database'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'star-2',
        title: 'Resolving Team Cross-Functional Conflict',
        situation: 'Design and engineering teams clashed over a complex UI component launch deadline.',
        task: 'Align both teams on an iterative release plan without delaying the marketing campaign.',
        action: 'Facilitated a joint scoping session to split the launch into MVP v1 and enhancement v2.',
        result: 'Delivered v1 on time with zero defect rate and established a collaborative RFC workflow.',
        tags: ['Leadership', 'Conflict Resolution', 'Agile'],
        createdAt: new Date().toISOString(),
      },
    ];
  } catch (err) {
    console.error('Failed to get STAR stories:', err);
    return [];
  }
}

export function saveSTARStory(story: STARStory): void {
  try {
    const stories = getSTARStories();
    const index = stories.findIndex((s) => s.id === story.id);
    if (index >= 0) {
      stories[index] = story;
    } else {
      stories.unshift(story);
    }
    localStorage.setItem(STORAGE_KEY_STAR_STORIES, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to save STAR story:', err);
  }
}

export function deleteSTARStory(storyId: string): void {
  try {
    const stories = getSTARStories().filter((s) => s.id !== storyId);
    localStorage.setItem(STORAGE_KEY_STAR_STORIES, JSON.stringify(stories));
  } catch (err) {
    console.error('Failed to delete STAR story:', err);
  }
}
