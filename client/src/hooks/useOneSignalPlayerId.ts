import { useState, useEffect } from 'react';

declare global {
  interface Window {
    OneSignal?: any;
  }
}

/**
 * Hook to get and store OneSignal Player ID
 * Returns the player ID from OneSignal or localStorage
 */
export function useOneSignalPlayerId() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPlayerId = async () => {
      try {
        // First check localStorage
        const storedPlayerId = localStorage.getItem('oneSignalPlayerId');
        if (storedPlayerId) {
          setPlayerId(storedPlayerId);
          setIsLoading(false);
        }

        // Then try to get from OneSignal
        if (window.OneSignal) {
          await window.OneSignal.init({
            appId: '5a9ded2d-f692-4e8c-9b3b-4233fe2b1ecc',
          });

          const id = await window.OneSignal.getUserId();
          if (id) {
            setPlayerId(id);
            localStorage.setItem('oneSignalPlayerId', id);
          }
        }
      } catch (error) {
        console.error('[useOneSignalPlayerId] Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getPlayerId();
  }, []);

  return { playerId, isLoading };
}

