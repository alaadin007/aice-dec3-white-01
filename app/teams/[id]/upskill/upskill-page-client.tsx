"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Team } from '@/lib/types';
import { getTeams } from '@/lib/storage';
import { ChevronLeft } from 'lucide-react';
import { TextInput } from '@/components/assessment/text-input';

export function UpskillPageClient({ params }: { params: { id: string } }) {
  const [team, setTeam] = useState<Team | null>(null);
  const router = useRouter();

  useEffect(() => {
    const teams = getTeams();
    const foundTeam = teams.find(t => t.id === params.id);
    setTeam(foundTeam || null);
  }, [params.id]);

  if (!team) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push('/dashboard')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Upskill {team.name}</h1>
              <p className="text-muted-foreground mt-2">
                Create an assessment for your team members
              </p>
            </div>

            <TextInput
              onAssessmentGenerated={(assessment, content) => {
                // Handle assessment generation for team
                console.log('Team assessment generated:', assessment);
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}