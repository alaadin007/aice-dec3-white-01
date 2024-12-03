import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AssessmentResult } from '@/lib/types';
import { Award, Eye, Calendar, Copy, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

interface AssessmentCardProps {
  assessment: AssessmentResult;
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();

  const handleCopyCertificate = async () => {
    try {
      setCopying(true);
      const certificateElement = document.getElementById('certificate-content');
      if (!certificateElement) return;

      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          toast({
            title: "Certificate Copied",
            description: "Certificate has been copied to your clipboard",
          });
        } catch (err) {
          handleDownload(blob);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy certificate",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
    }
  };

  const handleDownload = async (blob?: Blob) => {
    try {
      const certificateElement = document.getElementById('certificate-content');
      if (!certificateElement && !blob) return;

      let imageBlob = blob;
      if (!imageBlob) {
        const canvas = await html2canvas(certificateElement!, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
        });
        imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      }

      if (!imageBlob) throw new Error('Failed to create image');

      const url = URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AiCE-Certificate-${assessment.certificateId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Certificate Downloaded",
        description: "Your certificate has been downloaded as a PNG image",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download certificate",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold line-clamp-2">{assessment.topic}</h3>
              <p className="text-sm text-muted-foreground">
                {assessment.userInfo.firstName} {assessment.userInfo.lastName}
              </p>
            </div>
            <Badge variant={assessment.passed ? "success" : "destructive"}>
              {assessment.passed ? "Passed" : "Failed"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Award className="h-4 w-4 mr-2 text-primary" />
              <span>{assessment.learningOutcome.kiuAllocation} AiCE Points</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>{formatDate(assessment.date)}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Score: </span>
                <span>{(assessment.score * 100).toFixed(0)}%</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCertificate(true)}
                disabled={!assessment.passed}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Certificate
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Digital Certificate</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCertificate}
                  disabled={copying}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload()}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div id="certificate-content" className="p-8 space-y-6 bg-white rounded-lg border">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-primary">Certificate of Achievement</h2>
              <p className="text-xl text-muted-foreground">{assessment.topic}</p>
              
              <div className="my-8">
                <p className="text-lg">This is to certify that</p>
                <h3 className="text-2xl font-bold mt-2">
                  {assessment.userInfo.firstName} {assessment.userInfo.lastName}
                </h3>
                <p className="text-lg mt-2">
                  has successfully completed the assessment with distinction
                </p>
              </div>

              <div className="flex justify-center gap-12 my-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {assessment.learningOutcome.kiuAllocation}
                  </p>
                  <p className="text-sm text-muted-foreground">AiCE Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {assessment.learningOutcome.cpdPoints}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Hours Equivalent CPD/CME
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ({assessment.learningOutcome.academicLevel} Level)
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {(assessment.score * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Score Achieved</p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>Issued on: {formatDate(assessment.date)}</p>
                <p>Certificate ID: {assessment.certificateId}</p>
                <p>Verify at: verify.aice.education</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}