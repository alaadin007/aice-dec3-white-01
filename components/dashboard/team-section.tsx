"use client";

import { Team, TeamInvite } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Clock, Send, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

interface TeamSectionProps {
  teams: Team[];
  invites: TeamInvite[];
}

export function TeamSection({ teams, invites }: TeamSectionProps) {
  const router = useRouter();
  const pendingInvites = invites.filter(invite => invite.status === 'pending');

  if (teams.length === 0 && pendingInvites.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No teams yet</h3>
          <p className="text-muted-foreground">
            Create a team to collaborate and share assessments with colleagues
          </p>
          <Button onClick={() => router.push('/teams/new')} variant="outline">
            Create Team
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {pendingInvites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pending Invites</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingInvites.map((invite) => (
              <Card key={invite.id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Team Invitation</span>
                  </div>
                  <Badge>Pending</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Received {formatDate(invite.createdAt)}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => router.push(`/teams/invite/${invite.id}`)}
                >
                  View Invite
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {teams.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">My Teams</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {teams.map((team) => (
              <Card key={team.id} className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{team.name}</h4>
                  <Badge variant="outline">
                    {team.members.length} members
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Created by {team.createdBy.firstName} {team.createdBy.lastName}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Created {formatDate(team.createdAt)}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/teams/${team.id}`)}
                    className="w-full"
                  >
                    View Team
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => router.push(`/teams/${team.id}/upskill`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Upskill Team
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}