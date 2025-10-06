import React from 'react';
import { MessageSquare } from 'lucide-react';

interface AssistantLauncherProps {
  onClick: () => void;
}

const AssistantLauncher: React.FC<AssistantLauncherProps> = ({ onClick }) => {
  return (
    <div
      className="fixed right-6 z-50 flex items-center gap-3"
      style={{
        bottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Desktop Label and Beta Pill */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-white font-medium">
            OpsCentral Assistant
          </span>
          <span className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full">
            beta
          </span>
        </div>
      </div>
      
      {/* Launcher Button */}
      <button
        onClick={onClick}
        aria-label="Open OpsCentral Assistant"
        className="w-16 h-16 bg-accent-600 hover:bg-accent-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AssistantLauncher;