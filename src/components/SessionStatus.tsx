import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Check, Clock, Cloud, CloudOff, WifiOff } from 'lucide-react';

export function SessionStatus() {
  const { isAuthenticated, user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center gap-3">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Cloud className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">En ligne</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-600">Hors ligne</span>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />

        {/* Save Status */}
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {lastSaved ? `Sauvegardé ${formatTimeSince(lastSaved)}` : 'Sauvegardé'}
          </span>
        </div>

        {user && (
          <>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[100px] truncate">
                {user.username || user.email}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 10) return 'à l\'instant';
  if (seconds < 60) return `il y a ${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes}m`;
  
  const hours = Math.floor(minutes / 60);
  return `il y a ${hours}h`;
}
