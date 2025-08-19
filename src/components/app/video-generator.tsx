'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clapperboard } from 'lucide-react';

export function VideoGenerator() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Clapperboard className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline">Feature Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            We're working hard to bring the Image to Video generator to life. Stay tuned for exciting updates that will let you animate your photos!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
