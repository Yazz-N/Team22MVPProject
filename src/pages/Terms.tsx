import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Terms & Conditions
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            These terms and conditions govern your use of the OpsCentral platform and services.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Acceptance of Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">By using our platform, you agree to be bound by these terms and conditions.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Use of Services</h2>
              <p className="text-gray-600 dark:text-gray-400">Guidelines for appropriate use of OpsCentral services and features.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">User Responsibilities</h2>
              <p className="text-gray-600 dark:text-gray-400">Your obligations and responsibilities when using our platform.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-400">Information about intellectual property rights and usage restrictions.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400">Details about our liability limitations and disclaimers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;