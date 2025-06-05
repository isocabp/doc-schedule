"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface UploadImageProps {
  onUploadComplete: (url: string) => void;
  label?: string;
}

export function UploadImage({ onUploadComplete, label }: UploadImageProps) {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}

      {image ? (
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt="Foto"
            className="h-16 w-16 rounded-full object-cover"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setImage(null);
              onUploadComplete("");
            }}
          >
            Trocar
          </Button>
        </div>
      ) : (
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const url = res?.[0]?.url;
            if (url) {
              setImage(url);
              onUploadComplete(url);
            }
          }}
          onUploadError={(error) => {
            alert(`Erro no upload: ${error.message}`);
          }}
        />
      )}
    </div>
  );
}
