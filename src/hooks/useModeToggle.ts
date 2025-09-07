import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

export type Mode = 'demo' | 'live';

interface ModeStatus {
  currentMode: Mode;
  forceDemoMode: boolean;
  canGoLive: boolean;
  toolkitAvailable: boolean;
  credentialsConfigured: boolean;
  timestamp: string;
}

interface ModeToggleResponse {
  success: boolean;
  previousMode?: Mode;
  currentMode?: Mode;
  message?: string;
  error?: string;
  timestamp: string;
}

export function useModeToggle() {
  const [currentMode, setCurrentMode] = useState<Mode>('demo');
  const [canGoLive, setCanGoLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Fetch current mode status
  const fetchModeStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/mode/status');
      if (response.ok) {
        const status: ModeStatus = await response.json();
        setCurrentMode(status.currentMode);
        setCanGoLive(status.canGoLive);
        
        // Store in localStorage for persistence
        localStorage.setItem('visa-toolkit-mode', status.currentMode);
        
        return status;
      } else {
        console.warn('Failed to fetch mode status');
        // Fallback to localStorage or default
        const storedMode = localStorage.getItem('visa-toolkit-mode') as Mode;
        if (storedMode && ['demo', 'live'].includes(storedMode)) {
          setCurrentMode(storedMode);
        }
      }
    } catch (error) {
      console.warn('Error fetching mode status:', error);
      // Fallback to localStorage or default
      const storedMode = localStorage.getItem('visa-toolkit-mode') as Mode;
      if (storedMode && ['demo', 'live'].includes(storedMode)) {
        setCurrentMode(storedMode);
      }
    }
  }, []);

  // Toggle mode
  const toggleMode = useCallback(async (mode: Mode) => {
    if (loading || mode === currentMode) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/mode/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode }),
      });

      const result: ModeToggleResponse = await response.json();

      if (response.ok && result.success) {
        setCurrentMode(result.currentMode || mode);
        localStorage.setItem('visa-toolkit-mode', result.currentMode || mode);
        
        toast({
          title: "Mode Changed",
          description: result.message || `Switched to ${result.currentMode} mode`,
          variant: "default",
        });

        // Refresh mode status to get updated canGoLive status
        await fetchModeStatus();
      } else {
        toast({
          title: "Mode Change Failed",
          description: result.error || "Failed to change mode",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Mode Change Failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [loading, currentMode, fetchModeStatus, toast]);

  // Initialize on mount
  useEffect(() => {
    if (!initialized) {
      fetchModeStatus().then(() => {
        setInitialized(true);
      });
    }
  }, [initialized, fetchModeStatus]);

  // Refresh status periodically (every 30 seconds)
  useEffect(() => {
    if (!initialized) return;

    const interval = setInterval(() => {
      fetchModeStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [initialized, fetchModeStatus]);

  return {
    currentMode,
    canGoLive,
    loading,
    toggleMode,
    refreshStatus: fetchModeStatus,
  };
}