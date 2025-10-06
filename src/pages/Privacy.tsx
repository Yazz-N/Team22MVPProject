import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            This privacy policy explains how OpsCentral collects, uses, and protects your personal information when you use our platform.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Information We Collect</h2>
              <p className="text-gray-600 dark:text-gray-400">Details about the types of information we collect from users.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How We Use Your Information</h2>
              <p className="text-gray-600 dark:text-gray-400">Explanation of how we process and use your personal data.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Protection</h2>
              <p className="text-gray-600 dark:text-gray-400">Information about our security measures and data protection practices.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Rights</h2>
              <p className="text-gray-600 dark:text-gray-400">Details about your rights regarding your personal information.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact Us</h2>
              <p className="text-gray-600 dark:text-gray-400">How to reach us with privacy-related questions or concerns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;