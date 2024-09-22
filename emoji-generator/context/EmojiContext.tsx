'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Emoji {
  id: number;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
}

interface EmojiContextType {
  latestEmoji: Emoji | null;
  addEmoji: (emoji: Emoji) => void;
}

const EmojiContext = createContext<EmojiContextType | undefined>(undefined);

export function EmojiProvider({ children }: { children: ReactNode }) {
  const [latestEmoji, setLatestEmoji] = useState<Emoji | null>(null);

  const addEmoji = (emoji: Emoji) => {
    setLatestEmoji(emoji);
  };

  return (
    <EmojiContext.Provider value={{ latestEmoji, addEmoji }}>
      {children}
    </EmojiContext.Provider>
  );
}

export function useEmoji() {
  const context = useContext(EmojiContext);
  if (context === undefined) {
    throw new Error('useEmoji must be used within an EmojiProvider');
  }
  return context;
}