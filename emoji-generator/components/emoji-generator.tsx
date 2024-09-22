'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEmoji } from "@/context/EmojiContext";
import { Card } from "@/components/ui/card";

export default function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedEmoji, setGeneratedEmoji] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addEmoji } = useEmoji();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedEmoji(data.imageUrl);
        addEmoji({
          id: Date.now(), // Temporary ID, should be replaced with the actual ID from the backend
          image_url: data.imageUrl,
          prompt,
          likes_count: 0,
          creator_user_id: 'current_user_id', // Should be replaced with the actual user ID
        });
      } else {
        console.error('Failed to generate emoji:', data.error);
      }
    } catch (error) {
      console.error('Error generating emoji:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter emoji description"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Emoji'}
        </Button>
      </form>
      {generatedEmoji && (
        <div className="mt-4">
          <img src={generatedEmoji} alt="Generated Emoji" className="w-32 h-32 mx-auto" />
        </div>
      )}
    </Card>
  );
}