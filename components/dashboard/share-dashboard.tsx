"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { createShareableLink } from '@/lib/storage';
import { Share2, Copy, Key } from 'lucide-react';

interface ShareDashboardProps {
  userEmail: string;
}

export function ShareDashboard({ userEmail }: ShareDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [shareableUrl, setShareableUrl] = useState('');
  const { toast } = useToast();

  const handleCreateLink = () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password to protect your dashboard",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = createShareableLink(userEmail, password);
      const url = `${window.location.origin}/shared/${link.id}`;
      setShareableUrl(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create shareable link",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `Dashboard URL: ${shareableUrl}\nPassword: ${password}`
    );
    toast({
      title: "Copied to Clipboard",
      description: "The link and password have been copied",
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Share Dashboard"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Dashboard</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Set Access Password</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                  <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
                <Button onClick={handleCreateLink}>
                  Generate Link
                </Button>
              </div>
            </div>

            {shareableUrl && (
              <div className="space-y-2">
                <Label>Shareable Link</Label>
                <div className="flex space-x-2">
                  <Input value={shareableUrl} readOnly />
                  <Button variant="outline" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this link and password with employers. The link expires in 30 days.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}