"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Youtube, FileText, Link2, Plus, X } from "lucide-react";
import { db } from "@/lib/firebase"; // Import initialized Firebase instance
import { collection, addDoc, getDocs } from "firebase/firestore";

interface ContentSource {
  id: string;
  type: "text" | "youtube" | "file";
  content: string;
  source: string;
  wordCount: number;
}

interface ContentInputProps {
  onAssessmentGenerated: (assessment: any, content: string) => void;
}

export function ContentInput({ onAssessmentGenerated }: ContentInputProps) {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const webhookUrl = "https://medacles.app.n8n.cloud/webhook-test/c852b035-809e-4edb-a5f9-3835ead9add6";

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const sendToWebhook = async (data: any) => {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending to webhook:", error);
      toast({
        title: "Webhook Error",
        description: "Failed to send data to the webhook.",
        variant: "destructive",
      });
    }
  };

  const addTextSource = async () => {
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
      type: "text",
      content: currentText,
      source: "Manual Input",
      wordCount: getWordCount(currentText),
    };

    try {
      // Save to Firestore
      await addDoc(collection(db, "contentSources"), newSource);

      setSources([...sources, newSource]);
      setCurrentText("");

      // Send to webhook
      await sendToWebhook(newSource);

      toast({
        title: "Success",
        description: "Text content added successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    }
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
      // Assuming you have a function to fetch the transcript
      const transcript = await getYouTubeTranscript(youtubeUrl);
      const newSource: ContentSource = {
        id: `youtube_${Date.now()}`,
        type: "youtube",
        content: transcript,
        source: youtubeUrl,
        wordCount: getWordCount(transcript),
      };

      // Save to Firestore
      await addDoc(collection(db, "contentSources"), newSource);

      setSources([...sources, newSource]);
      setYoutubeUrl("");

      // Send to webhook
      await sendToWebhook(newSource);

      toast({
        title: "Success",
        description: "YouTube content added successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process YouTube video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAssessment = async () => {
    const combinedContent = sources.map((source) => source.content).join("\n\n");
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

    // Optionally, save the combined content to Firestore
    try {
      const assessment = {
        content: combinedContent,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "assessments"), assessment);

      // Send to webhook
      await sendToWebhook(assessment);

      toast({
        title: "Success",
        description: "Assessment saved successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="space-y-4">
        {/* Tabs for input */}
        {/* Add other tabs and functionalities */}
      </Tabs>
    </div>
  );
}
