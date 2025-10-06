import React from 'react';

const Cookies = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Cookie Settings
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            This page explains how OpsCentral uses cookies and similar technologies to enhance your experience.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What Are Cookies</h2>
              <p className="text-gray-600 dark:text-gray-400">Explanation of what cookies are and how they work on our platform.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Types of Cookies We Use</h2>
              <p className="text-gray-600 dark:text-gray-400">Details about the different categories of cookies we employ.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Essential Cookies</h2>
              <p className="text-gray-600 dark:text-gray-400">Information about cookies necessary for basic platform functionality.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Analytics Cookies</h2>
              <p className="text-gray-600 dark:text-gray-400">How we use cookies to understand platform usage and improve services.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Managing Your Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400">Instructions for controlling and managing your cookie preferences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;