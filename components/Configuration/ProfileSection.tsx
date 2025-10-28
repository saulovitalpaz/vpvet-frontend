'use client';

import React from 'react';
import { ConfigurationSection } from './ConfigurationSection';
import { ConfigurationField } from './ConfigurationField';
import { User } from 'lucide-react';

interface ProfileSectionProps {
  role: 'secretary' | 'client' | 'admin';
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  data?: {
    name?: string;
    email?: string;
    phone?: string;
    cpf?: string;
    role?: string;
    clinic?: string;
  };
  onChange?: (field: string, value: string) => void;
  clientData?: {
    tutor_name?: string;
    email?: string;
    phone?: string;
    tutor_cpf?: string;
  };
  pets?: any[];
}

export function ProfileSection({
  role,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  data,
  onChange,
  clientData,
  pets = []
}: ProfileSectionProps) {
  const getProfileData = () => {
    if (role === 'client' && clientData) {
      return {
        name: clientData.tutor_name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        cpf: clientData.tutor_cpf || ''
      };
    }
    return data || {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      role: '',
      clinic: ''
    };
  };

  const profileData = getProfileData();

  const handleFieldChange = (field: string, value: string) => {
    onChange?.(field, value);
  };

  const getSectionTitle = () => {
    switch (role) {
      case 'client':
        return 'Informações Pessoais';
      case 'admin':
        return 'Dados do Administrador';
      default:
        return 'Dados Pessoais';
    }
  };

  const getSectionDescription = () => {
    switch (role) {
      case 'client':
        return 'Atualize suas informações de contato e dados pessoais';
      case 'admin':
        return 'Gerencie suas informações de administrador';
      default:
        return 'Gerencie suas informações profissionais e de contato';
    }
  };

  return (
    <ConfigurationSection
      title={getSectionTitle()}
      description={getSectionDescription()}
      icon={<User className="w-5 h-5" />}
      isEditable={true}
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConfigurationField
          label="Nome Completo"
          value={profileData.name}
          type="text"
          isEditing={isEditing}
          onChange={(value) => handleFieldChange('name', value)}
          required
        />

        <ConfigurationField
          label="E-mail"
          value={profileData.email}
          type="email"
          isEditing={isEditing}
          onChange={(value) => handleFieldChange('email', value)}
          required
        />

        <ConfigurationField
          label="Telefone"
          value={profileData.phone}
          type="tel"
          isEditing={isEditing}
          onChange={(value) => handleFieldChange('phone', value)}
          placeholder="(00) 00000-0000"
        />

        <ConfigurationField
          label="CPF"
          value={profileData.cpf}
          type="text"
          isEditing={false} // CPF should not be editable
          onChange={(value) => handleFieldChange('cpf', value)}
        />

        {role !== 'client' && (
          <>
            <ConfigurationField
              label="Cargo"
              value={profileData.role}
              type="text"
              isEditing={false}
            />

            {profileData.clinic && (
              <ConfigurationField
                label="Clínica"
                value={profileData.clinic}
                type="text"
                isEditing={false}
              />
            )}
          </>
        )}
      </div>

      {role === 'client' && pets.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Informações do Tutor</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Pets cadastrados:</span> {pets.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Membro desde:</span>{' '}
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}
    </ConfigurationSection>
  );
}