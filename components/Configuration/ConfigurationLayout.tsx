'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ConfigurationLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  role: 'secretary' | 'client' | 'admin';
  onSave?: () => void;
  saveButtonText?: string;
  showSaveButton?: boolean;
  icon?: React.ReactNode;
}

export function ConfigurationLayout({
  children,
  title,
  subtitle,
  role,
  onSave,
  saveButtonText = 'Salvar Alterações',
  showSaveButton = true,
  icon
}: ConfigurationLayoutProps) {
  const getRoleSpecificStyles = () => {
    switch (role) {
      case 'client':
        return {
          headerBg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
          borderColor: 'border-emerald-200',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-700'
        };
      case 'admin':
        return {
          headerBg: 'bg-gradient-to-r from-purple-50 to-indigo-50',
          borderColor: 'border-purple-200',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-700'
        };
      default: // secretary
        return {
          headerBg: 'bg-gradient-to-r from-emerald-50 to-cyan-50',
          borderColor: 'border-emerald-200',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-700'
        };
    }
  };

  const styles = getRoleSpecificStyles();

  return (
    <div className="p-1 sm:p-2 md:p-4 lg:p-8">
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {children}
        </div>
      </div>

      {/* Save Button */}
      {showSaveButton && onSave && (
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={onSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2 min-h-[44px]"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}