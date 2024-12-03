import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Shield, Share2 } from 'lucide-react';
import { AssessmentResult } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ShareDashboard } from './share-dashboard';

interface ProfileHeaderProps {
  assessments: AssessmentResult[];
  verificationStatus?: boolean;
}

export function ProfileHeader({ assessments, verificationStatus }: ProfileHeaderProps) {
  const router = useRouter();
  const latestAssessment = assessments[0];
  const totalPoints = assessments.reduce((sum, assessment) => 
    sum + assessment.learningOutcome.kiuAllocation, 0
  );

  // Get user profile from localStorage
  const userProfile = typeof window !== 'undefined' ? 
    JSON.parse(localStorage.getItem('userProfile') || '{}') : {};

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userProfile.avatar} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-10 w-10 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div>
            {latestAssessment || userProfile.firstName ? (
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">
                  {userProfile.firstName || latestAssessment?.userInfo.firstName} {userProfile.lastName || latestAssessment?.userInfo.lastName}
                </h2>
                <p className="text-muted-foreground">{userProfile.email || latestAssessment?.userInfo.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="font-medium">
                    {totalPoints} Total AiCE Points
                  </Badge>
                  {userProfile.idVerification?.status === 'verified' ? (
                    <Badge variant="default" className="bg-green-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : userProfile.idVerification?.status === 'pending' ? (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Pending Verification
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Welcome to AiCE</h2>
                <p className="text-muted-foreground">Complete your first assessment to get started</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {(latestAssessment || userProfile.email) && (
            <ShareDashboard userEmail={userProfile.email || latestAssessment?.userInfo.email} />
          )}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push('/settings')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}