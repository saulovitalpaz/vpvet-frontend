'use client';

import React from 'react';
import { ConfigurationSection } from './ConfigurationSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Download } from 'lucide-react';

interface SystemSectionProps {
  role: 'secretary' | 'admin' | 'client';
  data?: {
    version?: string;
    lastBackup?: string;
    autoBackup?: boolean;
  };
  onBackup?: () => void;
  isEditable?: boolean;
}

export function SystemSection({
  role,
  data,
  onBackup,
  isEditable = true
}: SystemSectionProps) {
  const systemData = data || {
    version: '1.0.0',
    lastBackup: '2 horas atrás',
    autoBackup: true
  };

  const getSectionTitle = () => {
    switch (role) {
      case 'admin':
        return 'Configurações do Sistema';
      default:
        return 'Sistema';
    }
  };

  const getSectionDescription = () => {
    switch (role) {
      case 'admin':
        return 'Gerencie configurações avançadas do sistema';
      default:
        return 'Informações e configurações do sistema';
    }
  };

  return (
    <ConfigurationSection
      title={getSectionTitle()}
      description={getSectionDescription()}
      icon={<Database className="w-5 h-5" />}
      isEditable={false}
    >
      <div className="space-y-6">
        {/* Version Information */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Versão do Sistema</h4>
            <p className="text-xs text-gray-500 mt-1">VPVET Management System</p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            v{systemData.version}
          </Badge>
        </div>

        {/* Backup Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="text-sm font-medium text-emerald-900">Backup Automático</h4>
                <p className="text-xs text-emerald-700">Último backup: {systemData.lastBackup}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                Automático
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onBackup}
                disabled={!isEditable}
                className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Backup Manual
              </Button>
            </div>
          </div>
        </div>

  
        </div>
    </ConfigurationSection>
  );
}