'use client'

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function UserInitializer() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch('/api/create-user', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            console.error('Failed to create/verify user:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error creating/verifying user:', error);
        });
    }
  }, [isSignedIn, user]);

  return null; // This component doesn't render anything
}