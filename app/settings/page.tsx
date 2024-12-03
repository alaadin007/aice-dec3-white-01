"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, User, Shield, Upload, Camera } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  avatar?: string;
  idVerification?: {
    status: 'unverified' | 'pending' | 'verified';
    selfie?: string;
    idDocument?: string;
  };
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    idVerification: { status: 'unverified' }
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'selfie' | 'id') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create URL for preview
    const url = URL.createObjectURL(file);

    switch (type) {
      case 'avatar':
        setAvatarFile(file);
        setProfile(prev => ({ ...prev, avatar: url }));
        break;
      case 'selfie':
        setSelfieFile(file);
        setProfile(prev => ({
          ...prev,
          idVerification: {
            ...prev.idVerification!,
            selfie: url,
            status: 'pending'
          }
        }));
        break;
      case 'id':
        setIdFile(file);
        setProfile(prev => ({
          ...prev,
          idVerification: {
            ...prev.idVerification!,
            idDocument: url,
            status: 'pending'
          }
        }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });

    if (profile.idVerification?.status === 'pending') {
      toast({
        title: "ID Verification Pending",
        description: "Your ID verification is being processed",
      });
    }

    router.push('/dashboard');
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your profile information and verification status
              </p>
            </div>

            <div className="space-y-4">
              <Label>Profile Picture</Label>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'avatar')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">ID Verification</h2>
                  <p className="text-sm text-muted-foreground">
                    Verify your identity to receive authenticated certificates
                  </p>
                </div>
                <Badge variant={profile.idVerification?.status === 'verified' ? 'default' : 'outline'}>
                  <Shield className="h-3 w-3 mr-1" />
                  {profile.idVerification?.status === 'verified' ? 'Verified' : 
                   profile.idVerification?.status === 'pending' ? 'Pending' : 'Unverified'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Selfie Photo</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {profile.idVerification?.selfie ? (
                      <img 
                        src={profile.idVerification.selfie} 
                        alt="Selfie" 
                        className="max-h-32 mx-auto"
                      />
                    ) : (
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileChange(e, 'selfie')}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ID Document</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {profile.idVerification?.idDocument ? (
                      <img 
                        src={profile.idVerification.idDocument} 
                        alt="ID Document" 
                        className="max-h-32 mx-auto"
                      />
                    ) : (
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'id')}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}