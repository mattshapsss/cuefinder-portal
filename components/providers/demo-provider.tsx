'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { DEMO_USER, DEMO_VENUE } from '@/lib/demo/demoData';

interface DemoContextType {
  isDemo: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  demoUser: typeof DEMO_USER | null;
  demoVenue: typeof DEMO_VENUE | null;
}

const DemoContext = createContext<DemoContextType>({
  isDemo: false,
  enterDemoMode: () => {},
  exitDemoMode: () => {},
  demoUser: null,
  demoVenue: null
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);

  const enterDemoMode = () => {
    setIsDemo(true);
    // Store in session storage so it persists during navigation
    sessionStorage.setItem('cuefinder_demo_mode', 'true');
  };

  const exitDemoMode = () => {
    setIsDemo(false);
    sessionStorage.removeItem('cuefinder_demo_mode');
  };

  return (
    <DemoContext.Provider
      value={{
        isDemo,
        enterDemoMode,
        exitDemoMode,
        demoUser: isDemo ? DEMO_USER : null,
        demoVenue: isDemo ? DEMO_VENUE : null
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);