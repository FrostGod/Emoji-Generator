'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useEmoji } from "@/context/EmojiContext";

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
}

export default function EmojiGrid() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const { latestEmoji } = useEmoji();

  useEffect(() => {
    fetchEmojis();
  }, []);

  useEffect(() => {
    if (latestEmoji) {
      setEmojis(prevEmojis => [latestEmoji, ...prevEmojis]);
    }
  }, [latestEmoji]);

  const fetchEmojis = async () => {
    try {
      const response = await fetch('/api/get-emojis');
      const data = await response.json();
      if (data.success) {
        setEmojis(data.emojis);
      } else {
        console.error('Failed to fetch emojis:', data.error);
      }
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {emojis.map((emoji) => (
        <Card key={emoji.id} className="p-4 flex flex-col items-center">
          <img src={emoji.image_url} alt={emoji.prompt} className="w-24 h-24 object-contain" />
          <p className="mt-2 text-sm text-center">{emoji.prompt}</p>
        </Card>
      ))}
    </div>
  );
}