import { Card } from '@/components/ui/card';
import { ProficiencyScore, getLevelProgress } from '@/lib/proficiency';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProficiencyScoresProps {
  scores: ProficiencyScore[];
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

            <div className="space-y-2">
              <Progress 
                value={getLevelProgress(score.score, score.level)}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{score.level}</span>
                <span>
                  {score.level === 'PhD' ? 'Max Level' : `Next: ${
                    score.level === 'Middle School' ? 'High School' :
                    score.level === 'High School' ? 'Undergraduate' :
                    score.level === 'Undergraduate' ? 'Master\'s' :
                    'PhD'
                  }`}
                </span>
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
    </Card>
  );
}