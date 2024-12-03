import { AssessmentResult } from './types';

export interface ProficiencyScore {
  subjectGroup: string;
  score: number;
  assessments: AssessmentResult[];
  level: EducationLevel;
}

export type EducationLevel = 'Middle School' | 'High School' | 'Undergraduate' | 'Master\'s' | 'PhD';

export function getEducationLevel(points: number): EducationLevel {
  if (points <= 50) return 'Middle School';
  if (points <= 100) return 'High School';
  if (points <= 200) return 'Undergraduate';
  if (points <= 300) return 'Master\'s';
  return 'PhD';
}

export function calculateProficiencyScores(assessments: AssessmentResult[]): ProficiencyScore[] {
  const groupedAssessments = assessments.reduce((groups, assessment) => {
    const subjectGroup = extractSubjectGroup(assessment.topic);
    if (!groups[subjectGroup]) {
      groups[subjectGroup] = [];
    }
    groups[subjectGroup].push(assessment);
    return groups;
  }, {} as Record<string, AssessmentResult[]>);

  return Object.entries(groupedAssessments).map(([subjectGroup, groupAssessments]) => {
    const score = groupAssessments.reduce((sum, assessment) => 
      sum + assessment.learningOutcome.kiuAllocation, 0
    );

    return {
      subjectGroup,
      score,
      assessments: groupAssessments,
      level: getEducationLevel(score)
    };
  });
}

function extractSubjectGroup(topic: string): string {
  const commonSubjects = [
    'Medicine',
    'Technology',
    'Business',
    'Science',
    'Engineering',
    'Marketing',
    'Finance',
    'Healthcare',
    'Education'
  ];

  const found = commonSubjects.find(subject => 
    topic.toLowerCase().includes(subject.toLowerCase())
  );

  return found || 'General';
}

export function getLevelProgress(points: number, level: EducationLevel): number {
  const ranges = {
    'Middle School': { min: 0, max: 50 },
    'High School': { min: 51, max: 100 },
    'Undergraduate': { min: 101, max: 200 },
    'Master\'s': { min: 201, max: 300 },
    'PhD': { min: 301, max: 500 }
  };

  const range = ranges[level];
  const progress = ((points - range.min) / (range.max - range.min)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}