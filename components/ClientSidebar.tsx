'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import {
  Home,
  Heart,
  CalendarDays,
  FileText,
  Clock,
  User,
  LogOut
} from 'lucide-react';

interface ClientSidebarProps {
  onClose?: () => void;
}

export function ClientSidebar({ onClose }: ClientSidebarProps) {
  const pathname = usePathname();
  const { clientData, logoutClient } = usePublicAuth();

  const isActive = (path: string) => pathname === path;

  const navigation = [
    {
      name: 'Início',
      href: '/client-dashboard',
      icon: Home,
      current: isActive('/client-dashboard')
    },
    {
      name: 'Meus Pets',
      href: '/client-dashboard/pets',
      icon: Heart,
      current: isActive('/client-dashboard/pets')
    },
    {
      name: 'Consultas',
      href: '/client-dashboard/consultas',
      icon: CalendarDays,
      current: isActive('/client-dashboard/consultas')
    },
    {
      name: 'Exames',
      href: '/client-dashboard/exames',
      icon: FileText,
      current: isActive('/client-dashboard/exames')
    },
    {
      name: 'Histórico',
      href: '/client-dashboard/historico',
      icon: Clock,
      current: isActive('/client-dashboard/historico')
    },
    {
      name: 'Meus Dados',
      href: '/client-dashboard/meus-dados',
      icon: User,
      current: isActive('/client-dashboard/meus-dados')
    }
  ];

  const handleLogout = () => {
    logoutClient();
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile/Tablet Overlay - Hide on desktop */}
      {onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0">
        {/* Logo */}
        <div className="h-[76px] px-6 border-b border-gray-200 flex items-center">
          <Link href="/client-dashboard" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">VP</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">VPVET</h1>
              <p className="text-xs text-gray-500">Portal do Tutor</p>
            </div>
          </Link>
        </div>

  
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}

export default ClientSidebar;