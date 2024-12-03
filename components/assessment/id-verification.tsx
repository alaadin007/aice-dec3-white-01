import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Camera, Upload, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IdVerificationProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function IdVerification({ onComplete, onSkip }: IdVerificationProps) {
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'selfie' | 'id') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'selfie') {
      setSelfieFile(file);
    } else {
      setIdFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selfieFile || !idFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both a selfie and an ID document",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, we'll just simulate verification
    toast({
      title: "Verification Submitted",
      description: "Your ID verification has been submitted successfully",
    });
    
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Shield className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Verify Your Identity</h2>
        <p className="text-muted-foreground">
          To ensure certificate authenticity, please verify your identity
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Take a Selfie</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-2">
                <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Upload a clear photo of your face
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileChange(e, 'selfie')}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload ID Document</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Upload your passport or driving license
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'id')}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button type="submit" className="w-full">
              Submit Verification
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full"
              onClick={onSkip}
            >
              Skip for Now
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Your ID will be securely stored and used only for verification purposes
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}