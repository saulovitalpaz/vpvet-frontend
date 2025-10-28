'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Check, X, Key, Shield, Bell, User, Settings, Database } from 'lucide-react';

interface ConfigurationSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isEditable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  saveButtonText?: string;
  saveDisabled?: boolean;
  editButtonText?: string;
  className?: string;
}

export function ConfigurationSection({
  title,
  description,
  icon,
  children,
  isEditable = false,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  saveButtonText = 'Salvar',
  saveDisabled = false,
  editButtonText = 'Editar',
  className = ''
}: ConfigurationSectionProps) {
  const getIconForTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('perfil') || lowerTitle.includes('dados')) return <User className="w-5 h-5" />;
    if (lowerTitle.includes('segurança') || lowerTitle.includes('senha')) return <Shield className="w-5 h-5" />;
    if (lowerTitle.includes('notificação')) return <Bell className="w-5 h-5" />;
    if (lowerTitle.includes('sistema')) return <Database className="w-5 h-5" />;
    return <Settings className="w-5 h-5" />;
  };

  const displayIcon = icon || getIconForTitle(title);

  return (
    <Card className={`bg-white border border-gray-200/60 shadow-sm w-full max-w-full overflow-x-hidden ${className}`}>
      <CardHeader className="border-b border-gray-100 p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600">
              {displayIcon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>

          {isEditable && (
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button
                  onClick={onEdit}
                  variant="outline"
                  size="sm"
                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50 min-h-[44px] px-4"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{editButtonText}</span>
                  <span className="sm:hidden">Editar</span>
                </Button>
              ) : (
                <>
                  <Button
                    onClick={onSave}
                    disabled={saveDisabled}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-h-[44px] px-4"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">{saveButtonText}</span>
                    <span className="sm:hidden">Salvar</span>
                  </Button>
                  <Button
                    onClick={onCancel}
                    variant="outline"
                    size="sm"
                    className="text-gray-700 border-gray-200 hover:bg-gray-50 min-h-[44px] px-4"
                  >
                    <X className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Cancelar</span>
                    <span className="sm:hidden">Cancelar</span>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {children}
      </CardContent>
    </Card>
  );
}