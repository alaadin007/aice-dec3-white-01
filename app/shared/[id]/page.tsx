"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateShareableLink, getUserAssessments } from '@/lib/storage';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { AssessmentCard } from '@/components/dashboard/assessment-card';
import { ProficiencyScores } from '@/components/dashboard/proficiency-scores';
import { KnowledgeFusion } from '@/components/dashboard/knowledge-fusion';
import { calculateProficiencyScores } from '@/lib/proficiency';
import { calculateKFS } from '@/lib/kfs';

export default function SharedDashboardPage({ params }: { params: { id: string } }) {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const router = useRouter();

  const handleVerify = () => {
    const isValid = validateShareableLink(params.id, password);
    if (!isValid) {
      alert('Invalid password or expired link');
      return;
    }

    const links = JSON.parse(localStorage.getItem('aice_shareable_links') || '[]');
    const link = links.find((l: any) => l.id === params.id);
    if (!link) return;

    const userAssessments = getUserAssessments(link.userId);
    setAssessments(userAssessments);
    setIsVerified(true);
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 space-y-6">
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
                placeholder="Enter dashboard password"
              />
            </div>
            <Button onClick={handleVerify} className="w-full">
              View Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const proficiencyScores = calculateProficiencyScores(assessments);
  const kfs = calculateKFS(proficiencyScores);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Shared Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  View assessment history and achievements
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {assessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.certificateId}
                    assessment={assessment}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <ProficiencyScores scores={proficiencyScores} />
              <KnowledgeFusion kfs={kfs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}