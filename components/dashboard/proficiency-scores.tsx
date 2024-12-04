import { Card } from '@/components/ui/card';
import { ProficiencyScore, getLevelProgress, EducationLevel } from '@/lib/proficiency';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProficiencyScoresProps {
  scores: ProficiencyScore[];
}

const EDUCATION_LEVELS: EducationLevel[] = [
  'Middle School',
  'High School',
  'Undergraduate',
  'Master\'s',
  'PhD'
];

function Star({ size, glow }: { size: number; glow: number }) {
  return (
    <div 
      className="absolute"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `rgba(59, 130, 246, ${0.2 + (glow * 0.3)})`,
        borderRadius: '50%',
        boxShadow: `0 0 ${glow * 10}px ${glow * 5}px rgba(59, 130, 246, ${0.3 + (glow * 0.2)})`,
        animation: 'pulse 2s infinite ease-in-out'
      }}
    />
  );
}

export function ProficiencyScores({ scores }: ProficiencyScoresProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Proficiency Scores</h3>
          <p className="text-sm text-muted-foreground">
            Your subject-wise learning progress
          </p>
        </div>
        <Award className="h-5 w-5 text-primary" />
      </div>

      <div className="space-y-6">
        {scores.map((score) => (
          <div key={score.subjectGroup} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{score.subjectGroup}</h4>
                <p className="text-sm text-muted-foreground">
                  {score.level}
                </p>
              </div>
              <Badge variant="outline" className="font-semibold">
                {score.score} AiCE
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Progress 
                  value={getLevelProgress(score.score, score.level)}
                  className="h-2"
                />
                
                {/* Plot stars based on assessments */}
                {score.assessments.map((assessment, index) => {
                  const points = assessment.learningOutcome.kiuAllocation;
                  const position = getLevelProgress(points, score.level);
                  const size = Math.min(20, Math.max(8, points / 10));
                  const glow = Math.min(1, points / 100);
                  
                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: `${position}%`,
                        top: '-8px',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Star size={size} glow={glow} />
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between items-center">
                {EDUCATION_LEVELS.map((level, index) => (
                  <div 
                    key={level}
                    className={`text-xs ${level === score.level 
                      ? 'text-primary font-bold' 
                      : 'text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{level}</span>
                      {level === score.level && <span className="text-primary">*</span>}
                    </div>
                    {index < EDUCATION_LEVELS.length - 1 && (
                      <ChevronRight className="inline h-3 w-3 text-muted-foreground/50" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>
                Based on {score.assessments.length} assessment{score.assessments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}

        {scores.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>Complete assessments to build your proficiency scores</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Card>
  );
}