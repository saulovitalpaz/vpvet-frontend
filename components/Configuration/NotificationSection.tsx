'use client';

import React from 'react';
import { ConfigurationSection } from './ConfigurationSection';
import { ConfigurationToggle } from './ConfigurationToggle';
import { Bell, Mail } from 'lucide-react';

interface NotificationSectionProps {
  role: 'secretary' | 'client' | 'admin';
  data?: {
    systemNotifications?: boolean;
    emailAlerts?: boolean;
    appointmentReminders?: boolean;
    marketingEmails?: boolean;
    smsNotifications?: boolean;
  };
  onChange?: (field: string, value: boolean) => void;
  isEditable?: boolean;
}

export function NotificationSection({
  role,
  data,
  onChange,
  isEditable = true
}: NotificationSectionProps) {
  const notificationData = {
    systemNotifications: data?.systemNotifications ?? true,
    emailAlerts: data?.emailAlerts ?? false,
    appointmentReminders: data?.appointmentReminders ?? true,
    marketingEmails: data?.marketingEmails ?? false,
    smsNotifications: data?.smsNotifications ?? false
  };

  const handleToggleChange = (field: string, value: boolean) => {
    onChange?.(field, value);
  };

  const getSectionTitle = () => {
    switch (role) {
      case 'client':
        return 'Preferências de Notificação';
      case 'admin':
        return 'Configurações de Notificação';
      default:
        return 'Notificações';
    }
  };

  const getSectionDescription = () => {
    switch (role) {
      case 'client':
        return 'Escolha como deseja receber atualizações sobre seus pets';
      case 'admin':
        return 'Gerencie as notificações do sistema';
      default:
        return 'Configure suas preferências de notificação';
    }
  };

  return (
    <ConfigurationSection
      title={getSectionTitle()}
      description={getSectionDescription()}
      icon={<Bell className="w-5 h-5" />}
      isEditable={false}
    >
      <div className="space-y-1">
        <ConfigurationToggle
          label="Notificações do Sistema"
          description="Receber alertas importantes sobre o sistema"
          checked={notificationData.systemNotifications}
          onChange={(checked) => handleToggleChange('systemNotifications', checked)}
          disabled={!isEditable}
        />

        <ConfigurationToggle
          label="Lembretes de Agendamentos"
          description="Receber lembretes sobre consultas e exames agendados"
          checked={notificationData.appointmentReminders}
          onChange={(checked) => handleToggleChange('appointmentReminders', checked)}
          disabled={!isEditable}
        />

        <ConfigurationToggle
          label="Alertas por E-mail"
          description="Receber resumos e atualizações por e-mail"
          checked={notificationData.emailAlerts}
          onChange={(checked) => handleToggleChange('emailAlerts', checked)}
          disabled={!isEditable}
        />

        {role === 'client' && (
          <>
            <ConfigurationToggle
              label="Notificações por SMS"
              description="Receber alertas de última hora por mensagem de texto"
              checked={notificationData.smsNotifications}
              onChange={(checked) => handleToggleChange('smsNotifications', checked)}
              disabled={!isEditable}
            />

            <ConfigurationToggle
              label="E-mails Marketing"
              description="Receber novidades e promoções da VPVET"
              checked={notificationData.marketingEmails}
              onChange={(checked) => handleToggleChange('marketingEmails', checked)}
              disabled={!isEditable}
            />
          </>
        )}

        {role === 'admin' && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-900">Notificações Administrativas</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Como administrador, você receberá automaticamente notificações críticas do sistema, 
                  independentemente dessas configurações.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigurationSection>
  );
}