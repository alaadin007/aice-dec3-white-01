"use client";

import { LearningOutcome } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, Award, ChevronRight } from 'lucide-react';

interface LearningOutcomeViewProps {
  learningOutcome: LearningOutcome;
  onProceed: () => void;
}

export function LearningOutcomeView({ learningOutcome, onProceed }: LearningOutcomeViewProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{learningOutcome.title}</h2>
        <p className="text-muted-foreground">Review your learning outcomes before proceeding</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 space-y-2">
          <div className="flex items-center space-x-2 text-primary">
            <Award className="h-5 w-5" />
            <h3 className="font-semibold">AiCE Points</h3>
          </div>
          <p className="text-2xl font-bold">{learningOutcome.kiuAllocation} Points</p>
          <p className="text-sm text-muted-foreground">
            Based on {learningOutcome.academicLevel} level content
          </p>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center space-x-2 text-primary">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-semibold">CPD/CME Equivalence</h3>
          </div>
          <p className="text-2xl font-bold">{learningOutcome.learningTime} Hours</p>
          <p className="text-sm text-muted-foreground">
            ({learningOutcome.academicLevel} Level)
          </p>
        </Card>
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center space-x-2 text-primary">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">Content Summary</h3>
        </div>
        <p className="text-sm text-muted-foreground">{learningOutcome.summary}</p>
      </Card>

      <Button onClick={onProceed} className="w-full">
        Proceed to Assessment
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}