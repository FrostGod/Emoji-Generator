'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      
      const data = await response.json();
      setGeneratedImage(data.output);
    } catch (error) {
      console.error('Error generating image:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Input
        type="text"
        placeholder="Describe your image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleGenerate} disabled={isGenerating} className="w-full mb-4">
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </Button>
      {generatedImage && (
        <div className="mt-4">
          <img src={generatedImage} alt="Generated Image" className="w-full h-auto mx-auto" />
        </div>
      )}
    </div>
  );
}