"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { TeamFormData, teamSchema, Team, TeamMember } from '@/lib/types';
import { saveTeam, saveInvite } from '@/lib/storage';
import { ChevronLeft, Plus, X } from 'lucide-react';

export default function NewTeamPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      members: []
    }
  });

  const addEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    if (emails.includes(newEmail)) {
      toast({
        title: "Duplicate Email",
        description: "This email has already been added",
        variant: "destructive",
      });
      return;
    }
    setEmails([...emails, newEmail]);
    setNewEmail('');
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const onSubmit = async (data: TeamFormData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      const team: Team = {
        id: `team_${Date.now()}`,
        name: data.name,
        createdBy: userInfo,
        members: emails.map(email => ({
          email,
          status: 'pending',
        })),
        createdAt: new Date().toISOString(),
      };

      saveTeam(team);

      // Create invites for each team member
      team.members.forEach(member => {
        const invite = {
          id: `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          teamId: team.id,
          email: member.email,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        saveInvite(invite);
      });

      toast({
        title: "Team Created",
        description: "Team has been created and invites sent",
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
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
              <h1 className="text-2xl font-bold">Create New Team</h1>
              <p className="text-muted-foreground mt-2">
                Invite colleagues to join your team and share assessments
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter team name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Team Members (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                  <Button type="button" onClick={addEmail}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {emails.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {emails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span className="text-sm">{email}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmail(email)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Team
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}