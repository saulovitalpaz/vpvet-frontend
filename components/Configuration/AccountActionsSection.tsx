'use client';

import React from 'react';
import { ConfigurationSection } from './ConfigurationSection';
import { Button } from '@/components/ui/button';
import { Download, Trash2, AlertTriangle } from 'lucide-react';

interface AccountActionsSectionProps {
  onExportData?: () => void;
  onDeleteAccount?: () => void;
  isEditable?: boolean;
}

export function AccountActionsSection({
  onExportData,
  onDeleteAccount,
  isEditable = true
}: AccountActionsSectionProps) {
  return (
    <ConfigurationSection
      title="Gerenciamento da Conta"
      description="Opções avançadas para gerenciar sua conta"
      isEditable={false}
    >
      <div className="space-y-4">
        {/* Export Data */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Exportar Meus Dados</h4>
              <p className="text-xs text-gray-500">Baixe todas as suas informações e documentos em formato ZIP</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportData}
            disabled={!isEditable}
            className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-red-900">Excluir Conta</h4>
              <p className="text-xs text-red-700">Remova permanentemente sua conta e todos os dados associados</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteAccount}
            disabled={!isEditable}
            className="text-red-700 border-red-200 hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir Conta
          </Button>
        </div>

        {/* Warning Message */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-900">Importante</h4>
              <ul className="text-xs text-amber-700 mt-2 space-y-1">
                <li>• A exclusão da conta é permanente e não pode ser desfeita</li>
                <li>• Todos os seus dados, incluindo informações de pets, serão removidos</li>
                <li>• Histórico de consultas e exames será perdido</li>
                <li>• Recomendamos exportar seus dados antes de excluir a conta</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ConfigurationSection>
  );
}