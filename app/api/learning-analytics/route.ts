import { NextResponse } from 'next/server';

export interface LearningAnalyticsData {
  studyTime: number;
  sessions: number;
  completed: {
    current: number;
    total: number;
    percentage: number;
  };
  avgScore: number;
  streak: number;
  progress: number;
  learningActivity: {
    hasData: boolean;
    message: string;
    data: number[];
  };
  topicPerformance: {
    hasData: boolean;
    message: string;
    topics: string[];
    scores: number[];
  };
}

export async function GET() {
  // Generate mock data
  const hasData = Math.random() > 0.1;
  const mockData: LearningAnalyticsData = {
    studyTime: Math.floor(Math.random() * 1000),
    sessions: Math.floor(Math.random() * 50),
    completed: {
      current: Math.floor(Math.random() * 20),
      total: Math.floor(Math.random() * 20) + 10,
      percentage: Math.floor(Math.random() * 100),
    },
    avgScore: parseFloat((Math.random() * 100).toFixed(1)),
    streak: Math.floor(Math.random() * 30),
    progress: Math.floor(Math.random() * 100),
    learningActivity: {
      hasData: hasData,
      message: 'No activity data yet. Start learning to see your progress!',
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
    },
    topicPerformance: {
      hasData: hasData,
      message: 'No quiz data yet. Complete some quizzes to see your topic performance!',
      topics: ['数学', '英语', '物理', '化学', '生物', '历史'],
      scores: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)),
    },
  };

  return NextResponse.json(mockData);
}
