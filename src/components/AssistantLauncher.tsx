import React from 'react';
import { MessageSquare } from 'lucide-react';

interface AssistantLauncherProps {
  onClick: () => void;
}

const AssistantLauncher: React.FC<AssistantLauncherProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open OpsCentral Assistant"
      className="fixed right-6 z-50 bg-accent-600 hover:bg-accent-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 flex items-center justify-center lg:justify-start lg:gap-3 lg:px-4 lg:h-12 lg:rounded-full w-16 h-16 rounded-full"
      style={{
        bottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      <MessageSquare className="w-6 h-6" />
      <span className="hidden lg:inline font-medium">
        OpsCentral Assistant
      </span>
    </button>
  );
};

export default AssistantLauncher;