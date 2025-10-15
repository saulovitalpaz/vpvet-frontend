'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, FileText, Users, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Notification {
  id: string;
  type: 'appointment' | 'consultation' | 'patient';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Novo Agendamento',
    message: 'Thor - Ultrassom cardíaco às 11:00',
    time: 'Há 5 minutos',
    read: false,
  },
  {
    id: '2',
    type: 'consultation',
    title: 'Consulta Concluída',
    message: 'Laudo de Mimi foi finalizado',
    time: 'Há 1 hora',
    read: false,
  },
  {
    id: '3',
    type: 'patient',
    title: 'Novo Paciente',
    message: 'Rex foi cadastrado no sistema',
    time: 'Há 2 horas',
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'appointment':
      return <Calendar className="w-4 h-4" />;
    case 'consultation':
      return <FileText className="w-4 h-4" />;
    case 'patient':
      return <Users className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notificações</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {unreadCount} novas
                </span>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {mockNotifications.length > 0 ? (
              mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      !notification.read ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">Tudo em dia!</p>
                <p className="text-xs text-gray-500 mt-1">Você não tem notificações</p>
              </div>
            )}
          </div>
          {mockNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-100">
              <button className="w-full text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                Ver todas as notificações
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
