"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Team } from '@/lib/types';
import { getTeams } from '@/lib/storage';
import { ChevronLeft, Users } from 'lucide-react';

export function TeamPageClient({ params }: { params: { id: string } }) {
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{team.name}</h1>
                <p className="text-muted-foreground mt-1">
                  Created by {team.createdBy.firstName} {team.createdBy.lastName}
                </p>
              </div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <div className="space-y-2">
                {team.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span>{member.email}</span>
                    <span className="text-sm text-muted-foreground">
                      {member.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}