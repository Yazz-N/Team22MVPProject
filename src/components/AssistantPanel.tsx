import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, RotateCcw, FileText, Activity, Calendar, MessageSquare } from 'lucide-react';
import { chatStore } from '../lib/chat';
import { store } from '../lib/store';
import { supabase } from '../lib/supabaseClient';
import { supabaseConfigured } from '../lib/env';
import type { ChatThread, ChatMessage } from '../lib/chat/types';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToastMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load thread and messages on open
  useEffect(() => {
    const loadChat = async () => {
      if (!isOpen) return;
      
      try {
        // Get current user
        let currentUserId: string | null = null;
        if (supabaseConfigured && supabase) {
          const { data } = await supabase.auth.getSession();
          currentUserId = data?.session?.user?.id || null;
        }
        setUserId(currentUserId);

        // Get or create thread
        const thread = await chatStore.getOrCreateThreadForUser(currentUserId);
        setCurrentThread(thread);

        // Load messages
        const threadMessages = await chatStore.listMessages(thread.id);
        setMessages(threadMessages);
      } catch (error) {
        console.error('Failed to load chat:', error);
      }
    };

    loadChat();
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addMessage = async (role: 'user' | 'assistant' | 'system', content: string) => {
    if (!currentThread) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      threadid: currentThread.id,
      userid: userId,
      role,
      content,
      createdat: new Date().toISOString()
    };

    try {
      await chatStore.addMessage(message);
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleQuickAction = async (action: string) => {
    setLoading(true);
    
    try {
      // Add user message
      await addMessage('user', action);

      // Generate assistant response based on action
      let response = '';
      
      if (action === 'View my last uploaded document') {
        const flows = await store.listFlows();
        if (flows.length > 0) {
          const latest = flows[0];
          response = `Your most recent document is "${latest.filename}", uploaded ${new Date(latest.createdAt).toLocaleDateString('en-GB')}. Status: ${latest.status}.`;
        } else {
          response = 'You haven\'t uploaded any documents yet. Visit the Dashboard to get started.';
        }
      } else if (action === 'Update my process flow') {
        response = 'I can help you update your process flows. Click the button below to go to your Dashboard.';
      } else if (action === 'Check my recent activity') {
        const activities = await store.listActivity();
        if (activities.length > 0) {
          const recent = activities.slice(0, 3);
          response = `Here are your recent activities:\n\n${recent.map(a => `• ${a.message}`).join('\n')}`;
        } else {
          response = 'No recent activity found. Start by uploading a document or creating a process flow.';
        }
      } else if (action === 'Book a support call') {
        response = 'I\'d be happy to help you book a support call. Click the button below to schedule a time that works for you.';
      } else if (action === 'Something else…') {
        response = 'Please type your question or request in the message box below, and I\'ll do my best to help.';
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      // Add assistant response
      await addMessage('assistant', response);
    } catch (error) {
      console.error('Failed to handle quick action:', error);
      await addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const message = inputText.trim().slice(0, 250);
    setInputText('');
    setLoading(true);

    try {
      // Add user message
      await addMessage('user', message);
      
      // Add assistant acknowledgement
      await addMessage('assistant', 'Thanks — the team will review and get back to you.');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = async () => {
    if (!currentThread) return;
    
    if (window.confirm('Are you sure you want to clear this conversation?')) {
      try {
        await chatStore.clearThread(currentThread.id);
        
        // Reload messages
        const threadMessages = await chatStore.listMessages(currentThread.id);
        setMessages(threadMessages);
      } catch (error) {
        console.error('Failed to clear conversation:', error);
      }
    }
  };

  const navigateToDashboard = (tab?: string) => {
    onClose();
    if (tab === 'flows') {
      navigate('/dashboard?tab=flows');
    } else {
      navigate('/dashboard');
    }
  };

  const navigateToBooking = () => {
    onClose();
    navigate('/book');
  };

  const handleExportConversation = async () => {
    if (!currentThread) return;
    try {
      const threadMessages = await chatStore.listMessages(currentThread.id);
      
      const today = new Date().toISOString().split('T')[0];
      const userDisplay = userId || 'guest';
      
      let exportText = `OpsCentral Assistant — Chat Log\n`;
      exportText += `-------------------------------\n`;
      exportText += `Date: ${new Date().toISOString()}\n`;
      exportText += `User: ${currentThread.userid || 'guest'}\n\n`;
      
      threadMessages.forEach(message => {
        const timestamp = new Date(message.createdat).toLocaleString('en-GB', {
          hour12: false,
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        exportText += `[${timestamp}] ${message.role}: ${message.content}\n`;
      });
      
      const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OpsCentral_Chat_${today}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToastMessage('Chat exported successfully');
    } catch (error) {
      console.error('Failed to export conversation:', error);
      showToastMessage('Export failed', 'error');
    }
  };

  const formatTime = (createdAt: string) => {
    return new Date(createdAt).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickActions = [
    { label: 'View my last uploaded document', icon: FileText },
    { label: 'Update my process flow', icon: FileText },
    { label: 'Check my recent activity', icon: Activity },
    { label: 'Book a support call', icon: Calendar },
    { label: 'Something else…', icon: MessageSquare }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black bg-opacity-50 md:bg-transparent" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="w-full md:w-[480px] bg-white dark:bg-gray-800 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              OpsCentral Assistant
            </h2>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Coming soon
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearConversation}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Intro */}
          <div className="text-center py-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              How can I help today?
            </h3>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick actions:
            </h4>
            <div className="grid gap-2">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    disabled={loading}
                    className="flex items-center gap-3 p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                <p className="text-sm">Your conversation will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === 'system' ? (
                      <div className="text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {message.content}
                        </span>
                      </div>
                    ) : (
                      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' 
                              ? 'text-primary-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTime(message.createdat)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Action buttons for specific assistant messages */}
                    {message.role === 'assistant' && message.content.includes('go to your Dashboard') && (
                      <div className="flex justify-start mt-2">
                        <button
                          onClick={() => navigateToDashboard('flows')}
                          className="px-3 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    )}
                    
                    {message.role === 'assistant' && message.content.includes('schedule a time') && (
                      <div className="flex justify-start mt-2">
                        <button
                          onClick={navigateToBooking}
                          className="px-3 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
                        >
                          Open booking page
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={250}
              placeholder="Type a short message (max 250 characters)"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[44px]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                inputText.trim() && !loading
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="mt-1 text-right">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {inputText.length}/250
            </span>
          </div>
          
          {/* Export Conversation Button */}
          <div className="mt-3">
            <button
              onClick={handleExportConversation}
              title="Download your chat history as a text file"
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors min-h-[44px] text-sm"
            >
              Export Conversation (.txt)
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AssistantPanel;