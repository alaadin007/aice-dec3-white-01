"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AssessmentResult } from '@/lib/types';
import { SearchResult, searchCompetencies } from '@/lib/search';
import { useToast } from '@/hooks/use-toast';
import { Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LoadingQuote } from '@/components/ui/loading-quote';

interface CompetencySearchProps {
  assessments: AssessmentResult[];
}

export function CompetencySearch({ assessments }: CompetencySearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
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
    try {
      const searchResult = await searchCompetencies(query, assessments);
      setResult(searchResult);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to analyze competencies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {loading && <LoadingQuote />}

      {result && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge
              variant={
                result.confidence === 'High' ? 'default' :
                result.confidence === 'Medium' ? 'secondary' :
                'outline'
              }
            >
              {result.confidence} Confidence
            </Badge>
            {result.lastDemonstrated && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Last demonstrated: {formatDate(result.lastDemonstrated)}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <h3 className="font-medium">Direct Evidence</h3>
              </div>
              <p className="text-sm">{result.evidence.direct.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium">Related Experience</h3>
              </div>
              <p className="text-sm">{result.evidence.related.description}</p>
            </div>

            {result.recommendations.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Recommendations</h3>
                <ul className="text-sm space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}