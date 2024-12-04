"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Youtube, FileText, Link2, Plus, X } from 'lucide-react';
import { getYouTubeTranscript } from '@/lib/searchapi';

interface ContentSource {
  id: string;
  type: 'text' | 'youtube' | 'file';
  content: string;
  source: string;
  wordCount: number;
}

interface ContentInputProps {
  onAssessmentGenerated: (assessment: any, content: string) => void;
}

export function ContentInput({ onAssessmentGenerated }: ContentInputProps) {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const addTextSource = () => {
    if (!currentText.trim()) {
      toast({
        title: "Empty Content",
        description: "Please enter some text content",
        variant: "destructive",
      });
      return;
    }

    const newSource: ContentSource = {
      id: `text_${Date.now()}`,
      type: 'text',
      content: currentText,
      source: 'Manual Input',
      wordCount: getWordCount(currentText)
    };

    setSources([...sources, newSource]);
    setCurrentText('');
  };

  const addYoutubeSource = async () => {
    if (!youtubeUrl) {
      toast({
        title: "Invalid URL",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const transcript = await getYouTubeTranscript(youtubeUrl);
      const newSource: ContentSource = {
        id: `youtube_${Date.now()}`,
        type: 'youtube',
        content: transcript,
        source: youtubeUrl,
        wordCount: getWordCount(transcript)
      };

      setSources([...sources, newSource]);
      setYoutubeUrl('');
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

  const removeSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };

  const handleGenerateAssessment = () => {
    const combinedContent = sources.map(source => source.content).join('\n\n');
    const totalWords = sources.reduce((sum, source) => sum + source.wordCount, 0);

    if (totalWords < 50) {
      toast({
        title: "Insufficient Content",
        description: "Please add more content (minimum 50 words)",
        variant: "destructive",
      });
      return;
    }

    onAssessmentGenerated(null, combinedContent);
  };

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
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {getWordCount(currentText)} words
            </p>
            <Button onClick={addTextSource}>
              <Plus className="h-4 w-4 mr-2" />
              Add Text
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
            <Button onClick={addYoutubeSource} disabled={loading}>
              <Youtube className="h-4 w-4 mr-2" />
              Add Video
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

      {sources.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Content Sources</h3>
            <Badge variant="outline">
              {sources.reduce((sum, source) => sum + source.wordCount, 0)} total words
            </Badge>
          </div>

          <div className="space-y-2">
            {sources.map((source) => (
              <Card key={source.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {source.type === 'youtube' ? (
                        <Youtube className="h-4 w-4 text-red-500" />
                      ) : source.type === 'file' ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Link2 className="h-4 w-4 text-green-500" />
                      )}
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {source.wordCount} words
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSource(source.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button 
            onClick={handleGenerateAssessment}
            className="w-full"
            size="lg"
          >
            Generate Assessment
          </Button>
        </div>
      )}
    </div>
  );
}