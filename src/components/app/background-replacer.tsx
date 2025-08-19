'use client';

import { useState } from 'react';
import { backgroundReplacement } from '@/ai/flows/background-replacement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/app/image-uploader';
import { ResultDisplay } from '@/components/app/result-display';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export function BackgroundReplacer() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [backgroundPrompt, setBackgroundPrompt] = useState('A beautiful beach at sunset');
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUri || !backgroundPrompt) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please upload an image and provide a background prompt.",
      })
      return;
    }
    setIsLoading(true);
    setResultUri(null);

    try {
      const result = await backgroundReplacement({ photoDataUri: imageUri, backgroundPrompt });
      setResultUri(result.replacedPhotoDataUri);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMsg,
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="bg-image" className="text-base">1. Upload a photo</Label>
            <div className="mt-2">
              <ImageUploader
                onImageUpload={setImageUri}
                onImageClear={() => {
                  setImageUri(null);
                  setResultUri(null);
                }}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bg-prompt" className="text-base">2. Describe the new background</Label>
            <Input
              id="bg-prompt"
              value={backgroundPrompt}
              onChange={(e) => setBackgroundPrompt(e.target.value)}
              placeholder="e.g., A futuristic city, a fantasy forest"
              disabled={isLoading}
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !imageUri || !backgroundPrompt}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            Replace Background
          </Button>
        </form>
      </div>
      <div className="lg:col-span-2">
        <ResultDisplay originalUri={imageUri} resultUri={resultUri} isLoading={isLoading} />
      </div>
    </div>
  );
}
