import { Card } from '@/components/ui/card';
import { KnowledgeFusionScore } from '@/lib/kfs';
import { Brain, Zap, Star, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KnowledgeFusionProps {
  kfs: KnowledgeFusionScore;
}

export function KnowledgeFusion({ kfs }: KnowledgeFusionProps) {
  if (!kfs.isEligible) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Knowledge Fusion Score</h3>
            <p className="text-sm text-muted-foreground">
              Unlock your interdisciplinary potential
            </p>
          </div>
          <Brain className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
          <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Complete more assessments to unlock your KFS. You need at least two subjects with 100+ AiCE points each.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Knowledge Fusion Score</h3>
          <p className="text-sm text-muted-foreground">
            Your interdisciplinary learning score
          </p>
        </div>
        <Brain className="h-5 w-5 text-primary" />
      </div>

      <div className="text-center space-y-2">
        <div className="text-4xl font-bold text-primary">{kfs.total}</div>
        <p className="text-sm text-muted-foreground">Total KFS Points</p>
      </div>

      <div className="space-y-4">
        {kfs.major && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Major</p>
                <p className="text-xs text-muted-foreground">{kfs.major.subject}</p>
              </div>
            </div>
            <Badge variant="outline" className="font-semibold">
              {kfs.major.points} AiCE
            </Badge>
          </div>
        )}

        {kfs.minorA && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Minor A</p>
                <p className="text-xs text-muted-foreground">{kfs.minorA.subject}</p>
              </div>
            </div>
            <Badge variant="outline" className="font-semibold">
              {kfs.minorA.points} AiCE
            </Badge>
          </div>
        )}

        {kfs.minorB && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Minor B</p>
                <p className="text-xs text-muted-foreground">{kfs.minorB.subject}</p>
              </div>
            </div>
            <Badge variant="outline" className="font-semibold">
              {kfs.minorB.points} AiCE
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}