"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Question, UserResponse } from '@/lib/types';

interface QuestionViewProps {
  questions: Question[];
  onComplete: (responses: UserResponse[]) => void;
}

export function QuestionView({ questions, onComplete }: QuestionViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newResponses = [
      ...responses,
      {
        questionId: questions[currentQuestion].id,
        selectedAnswer,
      },
    ];

    setResponses(newResponses);
    setSelectedAnswer(null);

    if (currentQuestion === questions.length - 1) {
      onComplete(newResponses);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{question.text}</h3>
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(parseInt(value))}
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        onClick={handleNext}
        disabled={selectedAnswer === null}
        className="w-full"
      >
        {currentQuestion === questions.length - 1 ? 'Complete' : 'Next Question'}
      </Button>
    </div>
  );
}