'use client';

import { useState } from 'react';
import { bodyReshaping } from '@/ai/flows/body-reshaping';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ImageUploader } from '@/components/app/image-uploader';
import { ResultDisplay } from '@/components/app/result-display';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Textarea } from '@/components/ui/textarea';

export function BodyReshaper() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [transformationPrompt, setTransformationPrompt] = useState('Make the person in the photo look leaner and more muscular.');
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUri || !transformationPrompt) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please upload an image and provide a transformation prompt.",
      })
      return;
    }
    setIsLoading(true);
    setResultUri(null);

    try {
      const result = await bodyReshaping({ photoDataUri: imageUri, transformationPrompt });
      setResultUri(result.transformedPhotoDataUri);
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
            <Label htmlFor="body-image" className="text-base">1. Upload a photo</Label>
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
            <Label htmlFor="body-prompt" className="text-base">2. Describe the transformation</Label>
            <Textarea
              id="body-prompt"
              value={transformationPrompt}
              onChange={(e) => setTransformationPrompt(e.target.value)}
              placeholder="e.g., Slim down the waist, add more muscle to the arms"
              disabled={isLoading}
              className="mt-2"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !imageUri || !transformationPrompt}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            Reshape Body
          </Button>
        </form>
      </div>
      <div className="lg:col-span-2">
        <ResultDisplay originalUri={imageUri} resultUri={resultUri} isLoading={isLoading} />
      </div>
    </div>
  );
}
