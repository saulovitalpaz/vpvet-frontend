'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import {
  Home,
  Heart,
  CalendarDays,
  FileText,
  Clock,
  User,
  Settings,
  LogOut
} from 'lucide-react';

interface ClientSidebarProps {
  onClose?: () => void;
}

export function ClientSidebar({ onClose }: ClientSidebarProps) {
  const pathname = usePathname();
  const { clientData, logoutClient } = usePublicAuth();

  const isActive = (path: string) => pathname === path;

  // Keyboard navigation and accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (onClose) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

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
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out transform-gpu will-change-transform md:translate-x-0"
        aria-hidden={!onClose}
      >
        {/* Logo */}
        <div className="h-[76px] px-6 border-b border-gray-200 flex items-center">
          <Link href="/client-dashboard" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <Heart className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">VPVET</h1>
              <p className="text-xs text-gray-500">Portal do Tutor</p>
            </div>
          </Link>
        </div>

  
        {/* Navigation */}
        <nav
          className="flex-1 p-4 space-y-1"
          role="navigation"
          aria-label="Menu do cliente"
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-emerald-200 focus:ring-offset-0 relative hover:no-underline active:scale-[0.98] touch-manipulation ${
                  item.current
                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-1">
          <Link
            href="/client-dashboard/meus-dados"
            onClick={onClose}
            className={`flex items-center gap-4 px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-emerald-200 focus:ring-offset-0 relative hover:no-underline active:scale-[0.98] touch-manipulation ${
              isActive('/client-dashboard/meus-dados')
                ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            aria-current={isActive('/client-dashboard/meus-dados') ? 'page' : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="truncate">Meus Dados</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-emerald-200 focus:ring-offset-0 active:scale-[0.98] touch-manipulation text-left"
            aria-label="Sair do sistema"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="truncate">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default ClientSidebar;