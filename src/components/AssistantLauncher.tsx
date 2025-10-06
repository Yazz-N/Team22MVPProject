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
      className="fixed right-6 bottom-6 w-16 h-16 bg-accent-600 hover:bg-accent-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 z-50 flex items-center justify-center"
      style={{
        bottom: 'max(24px, env(safe-area-inset-bottom))',
      }}
    >
      <MessageSquare className="w-6 h-6" />
    </button>
  );
};

export default AssistantLauncher;