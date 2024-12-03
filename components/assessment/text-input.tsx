"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { generateQuestions } from '@/lib/openai';
import { getYouTubeTranscript, validateYouTubeUrl } from '@/lib/searchapi';
import { readFileContent, validateFileType } from '@/lib/file-utils';
import { Loader2, Youtube, FileText, Link2, Plus, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingQuote } from '@/components/ui/loading-quote';

interface TextInputProps {
  onAssessmentGenerated: (assessment: any, content: string) => void;
}

export function TextInput({ onAssessmentGenerated }: TextInputProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const { toast } = useToast();

  const handleTextSubmit = async () => {
    if (content.length < 50) {
      toast({
        title: "Content too short",
        description: "Please enter at least 50 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const assessment = await generateQuestions(content);
      onAssessmentGenerated(assessment, content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate assessment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleYoutubeSubmit = async () => {
    if (!validateYouTubeUrl(youtubeUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const transcript = await getYouTubeTranscript(youtubeUrl);
      const assessment = await generateQuestions(transcript);
      onAssessmentGenerated(assessment, transcript);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process YouTube video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingQuote />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="file">File Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Textarea
            placeholder="Paste your learning content here..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {content.length} characters
            </p>
            <Button onClick={handleTextSubmit}>
              Generate Assessment
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <Button onClick={handleYoutubeSubmit}>
              <Youtube className="h-4 w-4 mr-2" />
              Process
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="file" className="space-y-4">
          <Card className="p-8 border-dashed">
            <div className="flex flex-col items-center space-y-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Coming soon! Support for PDF, Word, and Excel files.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}