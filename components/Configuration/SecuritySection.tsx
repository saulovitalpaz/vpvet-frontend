'use client';

import React from 'react';
import { ConfigurationSection } from './ConfigurationSection';
import { ConfigurationField } from './ConfigurationField';
import { Shield, Key } from 'lucide-react';

interface SecuritySectionProps {
  role: 'secretary' | 'client' | 'admin';
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  data?: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  onChange?: (field: string, value: string) => void;
  showPasswordChange?: boolean;
}

export function SecuritySection({
  role,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  data,
  onChange,
  showPasswordChange = true
}: SecuritySectionProps) {
  const securityData = data || {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  const handleFieldChange = (field: string, value: string) => {
    onChange?.(field, value);
  };

  const getSectionTitle = () => {
    switch (role) {
      case 'client':
        return 'Segurança da Conta';
      case 'admin':
        return 'Segurança Administrativa';
      default:
        return 'Segurança';
    }
  };

  const getSectionDescription = () => {
    switch (role) {
      case 'client':
        return 'Proteja sua conta com uma senha forte';
      case 'admin':
        return 'Mantenha sua conta de administrador segura';
      default:
        return 'Gerencie sua senha e configurações de segurança';
    }
  };

  const validatePasswords = () => {
    if (securityData.newPassword && securityData.confirmPassword) {
      return securityData.newPassword === securityData.confirmPassword;
    }
    return true;
  };

  const getPasswordError = () => {
    if (securityData.newPassword && securityData.confirmPassword) {
      if (securityData.newPassword !== securityData.confirmPassword) {
        return 'As senhas não coincidem';
      }
      if (securityData.newPassword.length < 6) {
        return 'A senha deve ter pelo menos 6 caracteres';
      }
    }
    return '';
  };

  return (
    <ConfigurationSection
      title={getSectionTitle()}
      description={getSectionDescription()}
      icon={<Shield className="w-5 h-5" />}
      isEditable={showPasswordChange}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saveButtonText="Alterar Senha"
      saveDisabled={!validatePasswords() || !securityData.currentPassword || !securityData.newPassword}
    >
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConfigurationField
            label="Senha Atual"
            value={securityData.currentPassword}
            type="password"
            isEditing={isEditing}
            onChange={(value) => handleFieldChange('currentPassword', value)}
            showPasswordToggle={true}
            required
          />

          <ConfigurationField
            label="Nova Senha"
            value={securityData.newPassword}
            type="password"
            isEditing={isEditing}
            onChange={(value) => handleFieldChange('newPassword', value)}
            showPasswordToggle={true}
            required
            error={securityData.newPassword && securityData.newPassword.length < 6 ? 'Mínimo 6 caracteres' : ''}
          />

          <ConfigurationField
            label="Confirmar Nova Senha"
            value={securityData.confirmPassword}
            type="password"
            isEditing={isEditing}
            onChange={(value) => handleFieldChange('confirmPassword', value)}
            showPasswordToggle={true}
            required
            error={getPasswordError()}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Senha</p>
                <p className="text-xs text-gray-500">Alterada pela última vez: Não disponível</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">••••••••</span>
          </div>

          {role !== 'client' && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-900 mb-2">Dicas de Segurança</h4>
              <ul className="text-xs text-emerald-700 space-y-1">
                <li>• Use senhas com pelo menos 8 caracteres</li>
                <li>• Combine letras, números e caracteres especiais</li>
                <li>• Não use informações pessoais na senha</li>
                <li>• Altere sua senha regularmente</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </ConfigurationSection>
  );
}