import { ProficiencyScore, EducationLevel, getEducationLevel } from './proficiency';

export interface KnowledgeFusionScore {
  total: number;
  level: EducationLevel;
  major?: {
    subject: string;
    points: number;
    level: EducationLevel;
  };
  minorA?: {
    subject: string;
    points: number;
    level: EducationLevel;
  };
  minorB?: {
    subject: string;
    points: number;
    level: EducationLevel;
  };
  isEligible: boolean;
  dailyProgress?: {
    previous: number;
    current: number;
    change: number;
  };
}

export function calculateKFS(scores: ProficiencyScore[]): KnowledgeFusionScore {
  const eligibleScores = scores
    .filter(score => score.score >= 100)
    .sort((a, b) => b.score - a.score);

  if (eligibleScores.length < 2) {
    return {
      total: 0,
      level: 'Middle School',
      isEligible: false
    };
  }

  const result: KnowledgeFusionScore = {
    total: 0,
    level: 'Middle School',
    isEligible: true
  };

  // Assign major (highest points)
  if (eligibleScores[0]) {
    result.major = {
      subject: eligibleScores[0].subjectGroup,
      points: eligibleScores[0].score,
      level: eligibleScores[0].level
    };
  }

  // Assign minor A (second highest)
  if (eligibleScores[1]) {
    result.minorA = {
      subject: eligibleScores[1].subjectGroup,
      points: eligibleScores[1].score,
      level: eligibleScores[1].level
    };
  }

  // Assign minor B if available (third highest)
  if (eligibleScores[2]) {
    result.minorB = {
      subject: eligibleScores[2].subjectGroup,
      points: eligibleScores[2].score,
      level: eligibleScores[2].level
    };
  }

  // Calculate total KFS
  result.total = eligibleScores
    .slice(0, 3)
    .reduce((sum, score) => sum + score.score, 0);

  // Calculate KFS level
  result.level = getKFSLevel(result.total);

  // Calculate daily progress
  const previousTotal = getPreviousKFSTotal();
  if (previousTotal !== null) {
    result.dailyProgress = {
      previous: previousTotal,
      current: result.total,
      change: result.total - previousTotal
    };
  }

  // Store current total for future comparison
  localStorage.setItem('previousKFSTotal', result.total.toString());
  localStorage.setItem('lastKFSUpdate', new Date().toISOString());

  return result;
}

function getKFSLevel(total: number): EducationLevel {
  if (total <= 100) return 'Middle School';
  if (total <= 200) return 'High School';
  if (total <= 400) return 'Undergraduate';
  if (total <= 600) return 'Master\'s';
  return 'PhD';
}

function getPreviousKFSTotal(): number | null {
  const previousTotal = localStorage.getItem('previousKFSTotal');
  const lastUpdate = localStorage.getItem('lastKFSUpdate');

  if (!previousTotal || !lastUpdate) return null;

  // Only return previous total if it's from a different day
  const lastUpdateDate = new Date(lastUpdate).toDateString();
  const today = new Date().toDateString();

  if (lastUpdateDate === today) return null;

  return parseInt(previousTotal, 10);
}