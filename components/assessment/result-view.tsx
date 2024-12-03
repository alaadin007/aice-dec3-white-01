"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AssessmentResult, UserInfo } from '@/lib/types';
import { Award, CheckCircle2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IdVerification } from './id-verification';

interface ResultViewProps {
  result: AssessmentResult;
  onRestart: () => void;
  onRetake?: () => void;
  onUserInfoSubmitted: (result: AssessmentResult) => void;
}

export function ResultView({ result, onRestart, onRetake, onUserInfoSubmitted }: ResultViewProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [showForm, setShowForm] = useState(result.passed);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!userInfo.email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    const updatedResult = {
      ...result,
      userInfo,
      verified: true,
    };
    onUserInfoSubmitted(updatedResult);
  };

  const handleVerificationSkip = () => {
    const updatedResult = {
      ...result,
      userInfo,
      verified: false,
    };
    onUserInfoSubmitted(updatedResult);
  };

  if (showVerification) {
    return (
      <IdVerification
        onComplete={handleVerificationComplete}
        onSkip={handleVerificationSkip}
      />
    );
  }

  if (showForm && result.passed) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Assessment Complete!</h2>
          <p className="text-muted-foreground">
            You scored {result.score * 10}/10 ({(result.score * 100).toFixed(0)}%)
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={userInfo.firstName}
                  onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={userInfo.lastName}
                  onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Continue to Verification
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          {result.passed ? (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          ) : (
            <Award className="h-12 w-12 text-yellow-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold">Assessment Complete!</h2>
        <p className="text-muted-foreground">
          You scored {result.score * 10}/10 ({(result.score * 100).toFixed(0)}%)
        </p>
      </div>

      {!result.passed && (
        <Card className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-red-600 font-medium">
              You need 80% to pass the assessment.
            </p>
            <p className="text-sm text-muted-foreground">
              Don't worry! You can review the material and try again.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={onRetake}
              className="w-full"
              variant="secondary"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake Assessment
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Take your time to review the material before retaking
            </p>
          </div>
        </Card>
      )}

      <Button 
        onClick={onRestart} 
        className="w-full"
        variant={result.passed ? "outline" : "default"}
      >
        Start New Assessment
      </Button>
    </div>
  );
}