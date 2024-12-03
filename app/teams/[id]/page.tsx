"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Team, TeamMember } from '@/lib/types';
import { getTeamById } from '@/lib/storage';
import { ChevronLeft, Users, Send } from 'lucide-react';

export default function TeamPage({ params }: { params: { id: string } }) {
  const [team, setTeam] = useState<Team | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchedTeam = getTeamById(params.id);
    if (!fetchedTeam) {
      router.push('/dashboard');
      return;
    }
    setTeam(fetchedTeam);
  }, [params.id, router]);

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
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{team.name}</h1>
                <p className="text-muted-foreground mt-2">
                  Created by {team.createdBy.firstName} {team.createdBy.lastName}
                </p>
              </div>
              <Button
                onClick={() => router.push(`/teams/${team.id}/upskill`)}
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                Upskill Team
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Team Members</h2>
                <Badge variant="outline">
                  {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                </Badge>
              </div>

              <div className="space-y-2">
                {team.members.map((member: TeamMember) => (
                  <Card key={member.email} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{member.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.status === 'pending' ? 'Invitation pending' : 'Active member'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={member.status === 'pending' ? 'outline' : 'default'}>
                        {member.status === 'pending' ? 'Pending' : 'Active'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}