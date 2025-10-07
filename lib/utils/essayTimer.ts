// Essay Timer Utility for managing shared timer across essay pages

export interface EssayTimerData {
  startTime: number; // Unix timestamp when timer started
  duration: number; // Total duration in seconds
  isActive: boolean;
}

const STORAGE_KEY = 'essayTimerData';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';

export const essayTimer = {
  // Initialize timer with duration (in seconds)
  start(duration: number): void {
    if (!isBrowser) return;
    
    const timerData: EssayTimerData = {
      startTime: Date.now(),
      duration,
      isActive: true,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(timerData));
  },

  // Get remaining time in seconds
  getRemainingTime(): number {
    if (!isBrowser) return 0;
    
    const data = this.getData();
    if (!data || !data.isActive) {
      return 0;
    }

    const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
    const remaining = data.duration - elapsed;
    
    return remaining > 0 ? remaining : 0;
  },

  // Check if timer exists and is active
  isActive(): boolean {
    if (!isBrowser) return false;
    
    const data = this.getData();
    return data ? data.isActive && this.getRemainingTime() > 0 : false;
  },

  // Get timer data from storage
  getData(): EssayTimerData | null {
    if (!isBrowser) return null;
    
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored) as EssayTimerData;
    } catch {
      return null;
    }
  },

  // Stop/deactivate timer
  stop(): void {
    if (!isBrowser) return;
    
    const data = this.getData();
    if (data) {
      data.isActive = false;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  // Clear timer data
  clear(): void {
    if (!isBrowser) return;
    
    sessionStorage.removeItem(STORAGE_KEY);
  },

  // Add extra time (for upload page - 15 minutes)
  addExtraTime(extraSeconds: number): void {
    if (!isBrowser) return;
    
    const data = this.getData();
    if (data) {
      data.duration += extraSeconds;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  // Check if extra time has been added (to prevent multiple additions)
  hasExtraTime(): boolean {
    if (!isBrowser) return false;
    
    const hasExtra = sessionStorage.getItem('essayTimerExtraTimeAdded');
    return hasExtra === 'true';
  },

  // Mark that extra time has been added
  markExtraTimeAdded(): void {
    if (!isBrowser) return;
    
    sessionStorage.setItem('essayTimerExtraTimeAdded', 'true');
  },
};
