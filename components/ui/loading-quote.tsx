"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const quotes = [
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  }
];

export function LoadingQuote() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-8">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <div className="space-y-2">
          <p className="text-lg italic">"{quote.text}"</p>
          <p className="text-sm text-muted-foreground">— {quote.author}</p>
        </div>
      </div>
    </Card>
  );
}