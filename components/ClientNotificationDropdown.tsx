'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, FileText, Heart, CheckCircle2, Clock } from 'lucide-react';

interface ClientNotification {
  id: string;
  type: 'appointment' | 'exam_result' | 'pet_health' | 'reminder';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockClientNotifications: ClientNotification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Consulta Agendada',
    message: 'Thor - Consulta de rotina amanhã às 14:00',
    time: 'Há 2 horas',
    read: false,
  },
  {
    id: '2',
    type: 'exam_result',
    title: 'Resultado de Exame Disponível',
    message: 'Exame de sangue de Mimi está pronto para visualização',
    time: 'Há 1 dia',
    read: false,
  },
  {
    id: '3',
    type: 'pet_health',
    title: 'Lembrete de Vacina',
    message: 'Rex precisa da vacina antirrábica este mês',
    time: 'Há 3 dias',
    read: true,
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Medicação',
    message: 'Não se esqueça de dar o medicamento para Thor hoje',
    time: 'Há 1 semana',
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'appointment':
      return <Calendar className="w-4 h-4" />;
    case 'exam_result':
      return <FileText className="w-4 h-4" />;
    case 'pet_health':
      return <Heart className="w-4 h-4" />;
    case 'reminder':
      return <Clock className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
};

export function ClientNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockClientNotifications.filter(n => !n.read).length;

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
        <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-lg border border-gray-200 rounded-lg z-50">
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
            {mockClientNotifications.length > 0 ? (
              mockClientNotifications.map((notification) => (
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
          {mockClientNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-100">
              <button className="w-full text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                Ver todas as notificações
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}