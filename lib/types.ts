import { z } from "zod";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Assessment {
  questions: Question[];
  topic: string;
  learningOutcome: LearningOutcome;
}

export interface LearningOutcome {
  title: string;
  kiuAllocation: number;
  cpdPoints: number;
  summary: string;
  academicLevel: string;
  learningTime: number;
}

export interface UserResponse {
  questionId: number;
  selectedAnswer: number;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AssessmentResult {
  score: number;
  passed: boolean;
  responses: UserResponse[];
  topic: string;
  userName: string;
  userInfo: UserInfo;
  date: string;
  certificateId: string;
  learningOutcome: LearningOutcome;
  teamId?: string;
  invitedBy?: string;
}

export interface Team {
  id: string;
  name: string;
  createdBy: UserInfo;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  email: string;
  status: 'pending' | 'active';
  joinedAt?: string;
  assessments?: AssessmentResult[];
}

export interface TeamInvite {
  id: string;
  teamId: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  assessmentId?: string;
}

export interface ShareableLink {
  id: string;
  userId: string;
  password: string;
  expiresAt: string;
  createdAt: string;
}

export const teamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  members: z.array(z.string().email('Invalid email address')),
});

export type TeamFormData = z.infer<typeof teamSchema>;