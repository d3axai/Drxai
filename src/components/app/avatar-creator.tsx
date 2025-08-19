'use client';

import { useState } from 'react';
import { aiAvatarCreation } from '@/ai/flows/avatar-creation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/app/image-uploader';
import { ResultDisplay } from '@/components/app/result-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Terminal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export function AvatarCreator() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [profession, setProfession] = useState('Astronaut');
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUri || !profession) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please upload an image and specify a profession.",
      })
      return;
    }
    setIsLoading(true);
    setResultUri(null);

    try {
      const result = await aiAvatarCreation({ photoDataUri: imageUri, profession });
      setResultUri(result.avatarDataUri);
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
            <Label htmlFor="avatar-image" className="text-base">1. Upload your photo</Label>
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
            <Label htmlFor="profession" className="text-base">2. Enter a profession</Label>
            <Input
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g., Doctor, Pilot, Chef"
              disabled={isLoading}
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !imageUri || !profession}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            Generate Avatar
          </Button>
        </form>
      </div>
      <div className="lg:col-span-2">
        <ResultDisplay originalUri={imageUri} resultUri={resultUri} isLoading={isLoading} />
      </div>
    </div>
  );
}
