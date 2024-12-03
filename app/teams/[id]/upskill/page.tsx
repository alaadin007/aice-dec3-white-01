"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { TextInput } from '@/components/assessment/text-input';
import { getTeamById, saveInvite } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function TeamUpskillPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const team = getTeamById(params.id);

  const handleAssessmentGenerated = async (assessment: any) => {
    if (!team) return;

    // Create assessment invites for each team member
    team.members.forEach(member => {
      const invite = {
        id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        teamId: team.id,
        email: member.email,
        status: 'pending',
        createdAt: new Date().toISOString(),
        assessmentId: assessment.id // Store the assessment data
      };
      saveInvite(invite);
    });

    toast({
      title: "Assessment Shared",
      description: "Team members will receive an invitation to take the assessment",
    });

    router.push(`/teams/${team.id}`);
  };

  if (!team) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.push(`/teams/${team.id}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Team
        </Button>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Create Team Assessment</h1>
              <p className="text-muted-foreground mt-2">
                Create an assessment for {team.name} members
              </p>
            </div>

            <TextInput onAssessmentGenerated={handleAssessmentGenerated} />
          </div>
        </Card>
      </div>
    </div>
  );
}