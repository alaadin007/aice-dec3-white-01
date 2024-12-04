"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getShareableLinks, getAssessments } from '@/lib/storage';
import { ShareableLink, AssessmentResult } from '@/lib/types';
import { Lock, ChevronLeft } from 'lucide-react';

export function SharedDashboardClient({ params }: { params: { id: string } }) {
  const [link, setLink] = useState<ShareableLink | null>(null);
  const [password, setPassword] = useState('');
  const [verified, setVerified] = useState(false);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const links = getShareableLinks();
    const foundLink = links.find(l => l.id === params.id);
    setLink(foundLink || null);

    if (foundLink) {
      const userAssessments = getAssessments().filter(
        a => a.userInfo.email === foundLink.userId
      );
      setAssessments(userAssessments);
    }
  }, [params.id]);

  const handleVerify = () => {
    if (!link) return;

    if (password === link.password) {
      setVerified(true);
    } else {
      toast({
        title: "Invalid Password",
        description: "Please check the password and try again",
        variant: "destructive",
      });
    }
  };

  if (!link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 max-w-md w-full">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Link Not Found</h1>
            <p className="text-muted-foreground">
              This shared dashboard link is invalid or has expired.
            </p>
            <Button onClick={() => router.push('/')} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Lock className="h-12 w-12 mx-auto text-primary" />
              <h1 className="text-2xl font-bold">Protected Dashboard</h1>
              <p className="text-muted-foreground">
                Enter the password to view this dashboard
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>
              <Button onClick={handleVerify} className="w-full">
                View Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Return Home
        </Button>

        <div className="space-y-6">
          {assessments.map((assessment) => (
            <Card key={assessment.certificateId} className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">{assessment.topic}</h2>
                  <p className="text-muted-foreground">
                    {assessment.userInfo.firstName} {assessment.userInfo.lastName}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">AiCE Points</p>
                    <p className="text-lg font-semibold">
                      {assessment.learningOutcome.kiuAllocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPD/CME Hours</p>
                    <p className="text-lg font-semibold">
                      {assessment.learningOutcome.cpdPoints}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="text-lg font-semibold">
                      {(assessment.score * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Summary</p>
                  <p className="mt-1">
                    {assessment.learningOutcome.summary}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}