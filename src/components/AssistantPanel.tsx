import React, { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw, Plus, MessageSquare } from 'lucide-react';
import { store } from '../lib/store';
import type { ChatThread, ChatMessage } from '../lib/store/types';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ isOpen, onClose }) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load threads and messages on mount
  useEffect(() => {
    const loadData = async () => {
      if (!isOpen) return;
      
      try {
        const threadsData = await store.listChatThreads();
        setThreads(threadsData);
        
        // Load the most recent thread or create a new one
        if (threadsData.length > 0) {
          const latestThread = threadsData[0];
          setCurrentThread(latestThread);
          const messagesData = await store.listChatMessages(latestThread.id);
          setMessages(messagesData);
        } else {
          await createNewThread();
        }
      } catch (error) {
        console.error('Failed to load chat data:', error);
      }
    };

    loadData();
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

  const createNewThread = async () => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await store.addChatThread(newThread);
      setThreads(prev => [newThread, ...prev]);
      setCurrentThread(newThread);
      setMessages([]);
    } catch (error) {
      console.error('Failed to create new thread:', error);
    }
  };

  const switchThread = async (thread: ChatThread) => {
    setCurrentThread(thread);
    try {
      const messagesData = await store.listChatMessages(thread.id);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !currentThread || loading) return;

    setLoading(true);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      threadId: currentThread.id,
      role: 'user',
      content: inputText.trim(),
      createdAt: new Date().toISOString()
    };

    const saveMessage = async () => {
      try {
        await store.addChatMessage(newMessage);
        setMessages(prev => [...prev, newMessage]);
        
        // Update thread title if it's the first message
        if (messages.length === 0) {
          const title = inputText.trim().slice(0, 50) + (inputText.trim().length > 50 ? '...' : '');
          await store.updateChatThread(currentThread.id, { title });
          setThreads(prev => prev.map(t => t.id === currentThread.id ? { ...t, title } : t));
          setCurrentThread(prev => prev ? { ...prev, title } : null);
        }
        
        setInputText('');
      } catch (error) {
        console.error('Failed to save message:', error);
      } finally {
        setLoading(false);
      }
    };

    saveMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = async () => {
    if (!currentThread) return;
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await store.deleteChatThread(currentThread.id);
        setThreads(prev => prev.filter(t => t.id !== currentThread.id));
        
        // Switch to another thread or create new one
        const remainingThreads = threads.filter(t => t.id !== currentThread.id);
        if (remainingThreads.length > 0) {
          await switchThread(remainingThreads[0]);
        } else {
          await createNewThread();
        }
      } catch (error) {
        console.error('Failed to delete thread:', error);
      }
    }
  };

  const formatTime = (createdAt: string) => {
    return new Date(createdAt).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <div className="flex items-center gap-2">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Coming soon
              </p>
              {currentThread && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  • {currentThread.title}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={createNewThread}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="New conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
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

        {/* Thread List (if multiple threads) */}
        {threads.length > 1 && (
          <div className="border-b border-gray-200 dark:border-gray-700 p-2">
            <div className="flex gap-1 overflow-x-auto">
              {threads.slice(0, 3).map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => switchThread(thread)}
                  className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                    currentThread?.id === thread.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {thread.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Start a conversation with the OpsCentral Assistant</p>
              <p className="text-sm">Type a message below to get started</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' 
                      ? 'text-primary-100' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
              placeholder="Type your message..."
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
        </div>
      </div>
    </div>
  );
};

export default AssistantPanel;