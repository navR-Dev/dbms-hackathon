import React from 'react';
import { Bell, Lock, User, Globe } from 'lucide-react';

function Settings() {
  const sections = [
    {
      title: 'Profile',
      icon: User,
      settings: [
        {
          name: 'Name',
          description: 'Update your name and profile information',
          value: 'John Doe',
        },
        {
          name: 'Email',
          description: 'Manage your email preferences',
          value: 'john.doe@example.com',
        },
      ],
    },
    {
      title: 'Security',
      icon: Lock,
      settings: [
        {
          name: 'Password',
          description: 'Update your password',
          value: '••••••••',
        },
        {
          name: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          value: 'Disabled',
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          name: 'Email Notifications',
          description: 'Receive updates about your portfolio',
          value: 'Enabled',
        },
        {
          name: 'Push Notifications',
          description: 'Get instant alerts on your device',
          value: 'Disabled',
        },
      ],
    },
    {
      title: 'Preferences',
      icon: Globe,
      settings: [
        {
          name: 'Language',
          description: 'Choose your preferred language',
          value: 'English',
        },
        {
          name: 'Currency',
          description: 'Set your default currency',
          value: 'USD',
        },
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {section.settings.map((setting) => (
                  <div key={setting.name} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-4">{setting.value}</span>
                        <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Settings;