'use client';

import { useRouter } from 'next/navigation';
import { XCircle, Info } from 'lucide-react';

export default function DemoBanner() {
  const router = useRouter();
  
  const handleExitDemo = () => {
    // Clear demo mode
    sessionStorage.removeItem('cuefinder_demo_mode');
    // Navigate back to login
    router.push('/login');
  };

  // Only show if in demo mode
  if (typeof window === 'undefined' || sessionStorage.getItem('cuefinder_demo_mode') !== 'true') {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Info className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">Demo Mode</span>
            <span className="ml-2 opacity-90">
              You&apos;re exploring with sample data. Changes won&apos;t be saved.
            </span>
          </div>
        </div>
        <button
          onClick={handleExitDemo}
          className="flex items-center space-x-1 text-sm hover:text-purple-100 transition-colors"
        >
          <span>Exit Demo</span>
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}