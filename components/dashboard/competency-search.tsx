"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AssessmentResult } from '@/lib/types';
import { SearchResult, searchCompetencies } from '@/lib/search';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { SearchOverlay } from './search-overlay';

interface CompetencySearchProps {
  assessments: AssessmentResult[];
}

export function CompetencySearch({ assessments }: CompetencySearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowOverlay(true);
    try {
      const searchResult = await searchCompetencies(query, assessments);
      setResult(searchResult);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to analyze competencies",
        variant: "destructive",
      });
      setShowOverlay(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setResult(null);
    setQuery('');
  };

  return (
    <>
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Competency Search</h2>
          <p className="text-sm text-muted-foreground">
            Search through learning history and demonstrated skills
          </p>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="e.g., What experience do they have in machine learning?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      <SearchOverlay 
        isOpen={showOverlay}
        onClose={handleCloseOverlay}
        result={result}
        loading={loading}
        query={query}
      />
    </>
  );
}