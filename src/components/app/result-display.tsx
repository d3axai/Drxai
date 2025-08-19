'use client';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ResultDisplayProps {
  originalUri: string | null;
  resultUri: string | null;
  isLoading: boolean;
}

export function ResultDisplay({ originalUri, resultUri, isLoading }: ResultDisplayProps) {

  const handleDownload = () => {
    if (resultUri) {
      const link = document.createElement('a');
      link.href = resultUri;
      link.download = 'ai-motion-muse-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Original</CardTitle>
        </CardHeader>
        <CardContent className="p-2 aspect-square flex-1">
          {originalUri ? (
            <Image src={originalUri} alt="Original" width={512} height={512} className="rounded-md w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground p-4 text-center">Upload an image to get started</div>
          )}
        </CardContent>
      </Card>
      <ArrowRight className="hidden md:block w-8 h-8 text-muted-foreground mx-auto" />
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Result</CardTitle>
          {resultUri && !isLoading && (
            <Button variant="ghost" size="icon" onClick={handleDownload} aria-label="Download result">
              <Download className="w-5 h-5" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-2 aspect-square flex-1">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-md" />
          ) : resultUri ? (
            <Image src={resultUri} alt="Result" width={512} height={512} className="rounded-md w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground p-4 text-center">Your generated image will appear here</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
