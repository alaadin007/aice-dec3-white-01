"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssessmentCard } from '@/components/dashboard/assessment-card';
import { TeamSection } from '@/components/dashboard/team-section';
import { ProfileHeader } from '@/components/dashboard/profile-header';
import { ProficiencyScores } from '@/components/dashboard/proficiency-scores';
import { KnowledgeFusion } from '@/components/dashboard/knowledge-fusion';
import { CompetencySearch } from '@/components/dashboard/competency-search';
import { PlusCircle, BookOpen, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AssessmentResult, Team, TeamInvite } from '@/lib/types';
import { getAssessments, getTeams, getInvites } from '@/lib/storage';
import { calculateProficiencyScores } from '@/lib/proficiency';
import { calculateKFS } from '@/lib/kfs';

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedAssessments = getAssessments();
    const storedTeams = getTeams();
    const storedInvites = getInvites();
    setAssessments(storedAssessments);
    setTeams(storedTeams);
    setInvites(storedInvites);
  }, []);

  const proficiencyScores = calculateProficiencyScores(assessments);
  const kfs = calculateKFS(proficiencyScores);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          <ProfileHeader 
            assessments={assessments}
            verificationStatus={assessments.some(a => a.verified)}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground mt-2">
                    Manage your assessments and teams
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => router.push('/teams/new')} variant="outline">
                    <Users className="mr-2 h-5 w-5" />
                    New Team
                  </Button>
                  <Button onClick={() => router.push('/')} size="lg">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Assessment
                  </Button>
                </div>
              </div>

              <CompetencySearch assessments={assessments} />

              <Tabs defaultValue="assessments" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="assessments">My Assessments</TabsTrigger>
                  <TabsTrigger value="teams">Teams</TabsTrigger>
                </TabsList>

                <TabsContent value="assessments">
                  {assessments.length === 0 ? (
                    <Card className="p-12">
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">
                          <BookOpen className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No assessments yet</h3>
                        <p className="text-muted-foreground">
                          Start your first assessment to earn AiCE points and CPD/CME hours
                        </p>
                        <Button onClick={() => router.push('/')} variant="outline">
                          Start Assessment
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {assessments.map((assessment) => (
                        <AssessmentCard
                          key={assessment.certificateId}
                          assessment={assessment}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="teams">
                  <TeamSection teams={teams} invites={invites} />
                </TabsContent>
              </Tabs>
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