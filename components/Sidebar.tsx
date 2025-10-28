'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Calendar, Users, FileText, LayoutDashboard, Settings, LogOut, UserCheck, PawPrint, Home, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    name: 'Início',
    href: '/dashboard',
    icon: Home
  },
  {
    name: 'Agenda',
    href: '/agenda',
    icon: Calendar
  },
  {
    name: 'Clientes',
    href: '/clientes',
    icon: Users
  },
  {
    name: 'Pacientes',
    href: '/pacientes',
    icon: PawPrint
  },
  {
    name: 'Consultas',
    href: '/consultas',
    icon: FileText
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  // Keyboard navigation and accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile/Tablet Overlay - Hide on desktop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out transform-gpu will-change-transform",
          "md:translate-x-0", // Always visible on tablet+
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-hidden={!isOpen}
      >
      {/* Logo */}
      <div className="h-[76px] px-6 border-b border-gray-200 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
            <Heart className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">VPVET</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 p-4 space-y-1"
        role="navigation"
        aria-label="Menu principal de navegação"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 min-h-[48px]',
                'focus:outline-none focus:ring-emerald-200 focus:ring-offset-0',
                'relative hover:no-underline active:scale-[0.98] touch-manipulation',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onClose?.()} // Close mobile overlay after navigation
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
          href="/configuracoes"
          className={cn(
            'flex items-center gap-4 px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 min-h-[48px]',
            'focus:outline-none focus:ring-emerald-200 focus:ring-offset-0',
            'relative hover:no-underline active:scale-[0.98] touch-manipulation',
            pathname === '/configuracoes'
              ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
          aria-current={pathname === '/configuracoes' ? 'page' : undefined}
          onClick={() => onClose?.()} // Close mobile overlay after navigation
        >
          <Settings className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
          <span className="truncate">Configurações</span>
        </Link>
        <button
          onClick={logout}
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
