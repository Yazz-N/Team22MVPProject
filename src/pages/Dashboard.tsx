import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, FileText, Clock, Settings as SettingsIcon, Sparkles, Eye, Trash2, User, LogOut, Sun, Moon, Check, X } from 'lucide-react';
import { isAuthed, signOut } from '../lib/auth';
import { store } from '../lib/store';
import { supabase } from '../lib/supabaseClient';
import { supabaseConfigured } from '../lib/env';
import type { Flow, Activity } from '../lib/store/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [viewingFlow, setViewingFlow] = useState<Flow | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authed = await isAuthed();
      if (!authed) {
        navigate('/signin');
        return;
      }
      
      // Get user email if available
      if (supabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          setUserEmail(data?.session?.user?.email || 'Signed-in user');
        } catch {
          setUserEmail('Signed-in user');
        }
      } else {
        setUserEmail('Signed-in user');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  // Handle tab selection from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'flows') {
      setActiveTab('flows');
    }
  }, [location.search]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (loading) return;
      
      try {
        const [flowsData, activitiesData] = await Promise.all([
          store.listFlows(),
          store.listActivity()
        ]);
        setFlows(flowsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        showToast('Failed to load data', 'error');
      }
    };

    loadData();
  }, [loading]);

  // Check theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, []);

  // Focus page title on mount
  useEffect(() => {
    const titleElement = document.getElementById('dashboard-title');
    if (titleElement) {
      titleElement.focus();
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addActivity = async (message: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      message,
      createdAt: new Date().toISOString()
    };
    
    try {
      await store.addActivity(newActivity);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to save activity:', error);
      showToast('Failed to save activity', 'error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10 MB', 'error');
        return;
      }
      setSelectedFile(file);
      setShowSuccess(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10 MB', 'error');
        return;
      }
      setSelectedFile(file);
      setShowSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadLoading(true);
    
    // Upload to Supabase Storage if configured
    let storageError = false;
    if (supabaseConfigured && supabase) {
      try {
        const timestamp = Date.now();
        const filename = `${timestamp}-${selectedFile.name}`;
        const path = `${userEmail || 'anon'}/${filename}`;
        
        const { error } = await supabase.storage
          .from('documents')
          .upload(path, selectedFile);
          
        if (error) {
          console.error('Storage upload failed:', error);
          showToast('File upload failed - storage bucket may be missing', 'error');
          storageError = true;
        }
      } catch (error) {
        console.error('Storage upload error:', error);
        showToast('File upload failed - storage not available', 'error');
        storageError = true;
      }
    }

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newFlow: Flow = {
      id: Date.now().toString(),
      filename: selectedFile.name,
      createdAt: new Date().toISOString(),
      status: 'Draft'
    };

    try {
      await store.addFlow(newFlow);
      setFlows(prev => [newFlow, ...prev]);
      
      await addActivity(`Uploaded "${selectedFile.name}" → Draft Process Flow created`);
      
      setUploadLoading(false);
      setShowSuccess(true);
      if (!storageError) {
        showToast('Draft Process Flow created successfully');
      }
    } catch (error) {
      console.error('Failed to save process flow:', error);
      setUploadLoading(false);
      showToast('Failed to create Process Flow', 'error');
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setShowSuccess(false);
  };

  const handleDeleteFlow = async (id: string) => {
    const flow = flows.find(f => f.id === id);
    if (flow && window.confirm(`Are you sure you want to delete "${flow.filename}"?`)) {
      try {
        await store.deleteFlow(id);
        setFlows(prev => prev.filter(f => f.id !== id));
        await addActivity(`Deleted Process Flow "${flow.filename}"`);
        showToast('Process Flow deleted');
      } catch (error) {
        console.error('Failed to delete process flow:', error);
        showToast('Failed to delete Process Flow', 'error');
      }
    }
  };

  const handleUseTemplate = async (templateName: string) => {
    const newFlow: Flow = {
      id: Date.now().toString(),
      filename: `${templateName} Template`,
      createdAt: new Date().toISOString(),
      status: 'Draft'
    };

    try {
      await store.addFlow(newFlow);
      setFlows(prev => [newFlow, ...prev]);
      await addActivity(`Created Draft Process Flow from ${templateName} template`);
      showToast('Draft Process Flow created from template');
    } catch (error) {
      console.error('Failed to save template process flow:', error);
      showToast('Failed to create Process Flow from template', 'error');
    }
  };

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
      navigate('/signin');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const tabs = [
    { id: 'upload', label: 'Upload Document', icon: Upload },
    { id: 'flows', label: 'My Process Flows', icon: FileText },
    { id: 'activity', label: 'Recent Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'templates', label: 'Templates (Beta)', icon: Sparkles }
  ];

  const templates = [
    { name: 'Feature Release', description: 'Standard feature release process' },
    { name: 'Incident Response', description: 'Emergency incident handling workflow' },
    { name: 'New Hire Onboarding', description: 'Employee onboarding checklist' },
    { name: 'Content Review', description: 'Content approval and publishing process' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 
            id="dashboard-title"
            tabIndex={-1}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2 focus:outline-none"
          >
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Select a tab to get started.</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" role="tablist">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap min-h-[44px] ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div role="tabpanel">
          {activeTab === 'upload' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Upload a document to generate your process flow
              </h2>

              {!showSuccess ? (
                <div className="space-y-6">
                  {/* File Drop Zone */}
                  <div
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                      Drop your document here, or
                    </p>
                    <label className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg cursor-pointer transition-colors min-h-[44px]">
                      Choose file
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Supports PDF, DOCX, TXT files up to 10 MB
                    </p>
                  </div>

                  {/* Selected File Info */}
                  {selectedFile && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                          </p>
                        </div>
                        <button
                          onClick={handleClear}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || uploadLoading}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors min-h-[44px] ${
                        selectedFile && !uploadLoading
                          ? 'bg-accent-600 hover:bg-accent-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {uploadLoading ? 'Processing...' : 'Upload'}
                    </button>
                    <button
                      onClick={handleClear}
                      disabled={!selectedFile}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Draft Process Flow created
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 max-w-md mx-auto">
                    <div className="space-y-2 text-left">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Step 1: Intake</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Step 2: Review</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Step 3: Approval</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Step 4: Publish</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setSelectedFile(null);
                    }}
                    className="mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors min-h-[44px]"
                  >
                    Upload Another Document
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flows' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                My Process Flows
              </h2>

              {flows.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No process flows yet. Upload a document to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Created</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flows.map((flow) => (
                        <tr key={flow.id} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{flow.filename}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                              {flow.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {formatRelativeTime(flow.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setViewingFlow(flow)}
                                className="p-2 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteFlow(flow.id)}
                                className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>

              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No recent activity.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white">{activity.message}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Settings
              </h2>

              <div className="space-y-8">
                {/* Profile */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{userEmail}</p>
                        <p className="text-gray-600 dark:text-gray-400">Account holder</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <span className="text-gray-900 dark:text-white">
                        {isDark ? 'Dark' : 'Light'} theme
                      </span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors min-h-[44px]"
                    >
                      Switch to {isDark ? 'Light' : 'Dark'}
                    </button>
                  </div>
                </div>

                {/* Sign Out */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Account</h3>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Templates (Beta)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div key={template.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {template.description}
                    </p>
                    <button
                      onClick={() => handleUseTemplate(template.name)}
                      className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors min-h-[44px]"
                    >
                      Use Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Flow Modal */}
      {viewingFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {viewingFlow.filename}
              </h3>
              <button
                onClick={() => setViewingFlow(null)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">Step 1: Intake</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">Step 2: Review</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">Step 3: Approval</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-900 dark:text-white">Step 4: Publish</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <Check className="w-5 h-5" />
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Dashboard;