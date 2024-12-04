"use client";

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/lib/search';
import { Badge } from '@/components/ui/badge';
import { LoadingQuote } from '@/components/ui/loading-quote';
import { formatDate } from '@/lib/utils';
import { Search, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  result: SearchResult | null;
  loading: boolean;
  query: string;
}

export function SearchOverlay({ isOpen, onClose, result, loading, query }: SearchOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogTitle className="flex justify-between items-center pr-8">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <span>Search Results</span>
          </div>
        </DialogTitle>

        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">{query}</p>

          {loading ? (
            <LoadingQuote />
          ) : result ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    result.confidence === 'High' ? 'default' :
                    result.confidence === 'Medium' ? 'secondary' :
                    'outline'
                  }
                  className="text-sm"
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

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium">Direct Evidence</h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">{result.evidence.direct.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">Related Experience</h3>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">{result.evidence.related.description}</p>
                  </div>
                </div>

                {result.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Recommendations</h3>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <ul className="text-sm space-y-2">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}