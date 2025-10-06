import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { getCookiePrefs, setCookiePrefs, CookiePreferences } from '../utils/cookies';

const Cookies = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    marketing: false
  });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Load existing preferences on component mount
    const savedPrefs = getCookiePrefs();
    setPreferences(savedPrefs);
  }, []);

  const handleToggle = (type: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSave = () => {
    setCookiePrefs(preferences);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleReset = () => {
    const defaultPrefs = { analytics: false, marketing: false };
    setPreferences(defaultPrefs);
    setCookiePrefs(defaultPrefs);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Cookie Settings
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Manage your cookie preferences to control how we collect and use data to improve your experience.
          </p>

          <div className="space-y-8">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
                </p>
              </div>
              <div className="ml-6">
                <div className="relative inline-block w-12 h-6">
                  <div className="w-12 h-6 bg-primary-600 rounded-full shadow-inner"></div>
                  <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">Always On</p>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.
                </p>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => handleToggle('analytics')}
                  className="relative inline-block w-12 h-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                >
                  <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${
                    preferences.analytics ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  These cookies are used to track visitors across websites to display relevant advertisements and measure the effectiveness of our marketing campaigns.
                </p>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => handleToggle('marketing')}
                  className="relative inline-block w-12 h-6 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
                >
                  <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${
                    preferences.marketing ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Check className="w-5 h-5" />
          Preferences saved
        </div>
      )}
    </div>
  );
};

export default Cookies;