'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, CreditCard, Key, Eye, EyeOff } from 'lucide-react';

interface ConfigurationFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'textarea';
  isEditing?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  showPasswordToggle?: boolean;
  rows?: number; // for textarea
}

export function ConfigurationField({
  label,
  value = '',
  placeholder,
  type = 'text',
  isEditing = false,
  onChange,
  icon,
  required = false,
  disabled = false,
  error,
  className = '',
  showPasswordToggle = false,
  rows = 3
}: ConfigurationFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'tel':
        return <Phone className="w-4 h-4" />;
      case 'password':
        return <Key className="w-4 h-4" />;
      case 'cpf':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const displayIcon = icon || getIconForType(type);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const formatValue = (value: string, type: string) => {
    switch (type) {
      case 'cpf':
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      case 'tel':
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 11) {
          return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        }
        return value;
      default:
        return value;
    }
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={label} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {isEditing ? (
        <div className="relative">
          {type === 'textarea' ? (
            <Textarea
              id={label}
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={`resize-none ${error ? 'border-red-500' : ''}`}
            />
          ) : (
            <Input
              id={label}
              type={inputType}
              value={localValue}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`${error ? 'border-red-500' : ''}`}
            />
          )}

          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
          <div className="text-gray-400 flex-shrink-0">
            {displayIcon}
          </div>
          <span className="text-gray-900 flex-1 truncate min-w-0">
            {value ? formatValue(value, type) : 'Não informado'}
          </span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}