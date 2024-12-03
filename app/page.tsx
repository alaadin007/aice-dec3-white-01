"use client";

import { useState } from 'react';
import { TextInput } from '@/components/assessment/text-input';
import { QuestionView } from '@/components/assessment/question-view';
import { ResultView } from '@/components/assessment/result-view';
import { LearningOutcomeView } from '@/components/assessment/learning-outcome';
import { Assessment, AssessmentResult, UserResponse } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { saveAssessment } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { Youtube, FileText, Link2, Sparkles, Star, Brain, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [currentContent, setCurrentContent] = useState<string>('');
  const router = useRouter();

  const handleAssessmentGenerated = (newAssessment: Assessment, content: string) => {
    setAssessment(newAssessment);
    setCurrentContent(content);
  };

  const handleStartAssessment = () => {
    setShowQuestions(true);
  };

  const handleCompleteAssessment = (responses: UserResponse[]) => {
    if (!assessment) return;

    const score = responses.reduce((acc, response) => {
      const question = assessment.questions.find(q => q.id === response.questionId);
      return question?.correctAnswer === response.selectedAnswer ? acc + 1 : acc;
    }, 0) / assessment.questions.length;

    const result: AssessmentResult = {
      score,
      passed: score >= 0.8,
      responses,
      topic: assessment.topic,
      userName: '',
      userInfo: { firstName: '', lastName: '', email: '' },
      date: new Date().toISOString(),
      certificateId: `CERT-${Date.now()}`,
      learningOutcome: assessment.learningOutcome
    };

    setResult(result);
  };

  const handleUserInfoSubmitted = (updatedResult: AssessmentResult) => {
    saveAssessment(updatedResult);
    router.push('/dashboard');
  };

  const handleRestart = () => {
    setAssessment(null);
    setShowQuestions(false);
    setResult(null);
    setCurrentContent('');
  };

  const handleRetake = () => {
    setShowQuestions(true);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Learn, Share, Earn Credits
            </h1>
          </div>
          <p className="text-xl text-gray-700 mb-2">
            Turn Your Content into Professional Credits
          </p>
          <p className="text-gray-500">
            Instant Equivalent CPD, CME, CE & More - No Login Required
          </p>
          <Badge variant="outline" className="mt-4">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Try the Demo - No Login Required
          </Badge>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-gray-100 mb-12">
          <div className="space-y-6">
            {!assessment && (
              <TextInput onAssessmentGenerated={handleAssessmentGenerated} />
            )}
            {assessment && !showQuestions && !result && (
              <LearningOutcomeView
                learningOutcome={assessment.learningOutcome}
                onProceed={handleStartAssessment}
              />
            )}
            {showQuestions && !result && (
              <QuestionView
                questions={assessment!.questions}
                onComplete={handleCompleteAssessment}
              />
            )}
            {result && (
              <ResultView
                result={result}
                onRestart={handleRestart}
                onRetake={handleRetake}
                onUserInfoSubmitted={handleUserInfoSubmitted}
              />
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                AI-Powered Analysis
              </h3>
            </div>
            <p className="text-gray-600">
              Our AI analyzes your content depth and generates relevant assessments in seconds.
            </p>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Instant Recognition
              </h3>
            </div>
            <p className="text-gray-600">
              Share any educational content and get instant professional development credits recognized worldwide.
            </p>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Multiple Formats
              </h3>
            </div>
            <p className="text-gray-600">
              Support for YouTube videos, documents, and web content - all converted into valuable credits instantly.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}