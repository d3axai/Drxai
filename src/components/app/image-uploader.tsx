'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUpload: (dataUri: string) => void;
  onImageClear: () => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageUpload, onImageClear, disabled }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        setPreview(dataUri);
        onImageUpload(dataUri);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    multiple: false,
    disabled,
  });

  const handleClear = () => {
    setPreview(null);
    onImageClear();
  };

  if (preview) {
    return (
      <div className="relative group w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
        <Image src={preview} alt="Image preview" fill objectFit="contain" className="rounded-lg p-2" />
        <Button
          variant="destructive"
          size="icon"
          onClick={handleClear}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Remove image"
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 transition-colors',
        isDragActive ? 'border-primary bg-primary/10' : 'border-border',
        disabled ? 'cursor-not-allowed bg-muted/50' : 'cursor-pointer hover:border-primary'
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
      <p className="font-semibold">Drag & drop an image here</p>
      <p className="text-sm text-muted-foreground">or click to select a file</p>
      <p className="text-xs text-muted-foreground mt-2">PNG, JPG, WEBP</p>
    </div>
  );
}
