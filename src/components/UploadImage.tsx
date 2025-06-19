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
    <div className="flex flex-col gap-3 w-full text-center">
      {label && (
        <Label className="text-base font-medium text-neutral-700 mb-1">
          {label}
        </Label>
      )}

      {image ? (
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt="Foto"
            className="h-16 w-16 rounded-full object-cover border border-neutral-300"
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
        <div className="w-full flex justify-center">
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              button:
                "bg-primary hover:bg-blue-600 text-white font-medium text-sm px-4 py-1 rounded-md transition-all duration-200",
              container: "w-full flex flex-col items-center gap-2",
              allowedContent: "text-sm text-gray-500 mt-1",
            }}
            content={{
              button: "Escolher imagem",
              allowedContent: "Imagem (4MB)",
            }}
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
        </div>
      )}
    </div>
  );
}
