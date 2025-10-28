'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { AdminDropdown } from '@/components/admin/AdminDropdown';
import {
  Shield,
  Settings,
  BarChart3,
  Users,
  Building,
  Calendar,
  FileText,
  Upload,
  ArrowLeft,
  Bell,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNavItems = [
    {
      href: '/admin',
      label: 'Início Admin',
      icon: BarChart3,
    },
    {
      href: '/admin/clinics',
      label: 'Clínicas',
      icon: Building,
    },
    {
      href: '/admin/users',
      label: 'Usuários',
      icon: Users,
    },
    {
      href: '/admin/clients',
      label: 'Clientes',
      icon: FileText,
    },
    {
      href: '/admin/analytics',
      label: 'Análises',
      icon: BarChart3,
    },
    {
      href: '/admin/uploads',
      label: 'Upload Exames',
      icon: Upload,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Admin Header */}
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 h-[76px] relative z-20">
            <div className="flex items-center justify-between h-full">
              {/* Mobile menu button - Hide on tablet and desktop */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-3 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-emerald-200 focus:ring-offset-0"
                aria-label="Abrir menu de navegação"
                aria-expanded={sidebarOpen}
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              <div className="hidden lg:flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                  {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Notification Dropdown */}
                <div className="relative">
                  <NotificationDropdown />
                </div>

                {/* Admin Dropdown */}
                <div className="relative">
                  <AdminDropdown />
                </div>
              </div>
            </div>
          </header>

          {/* Admin Navigation Submenu - Hide on mobile, show on tablet and desktop */}
          <nav className="hidden md:block bg-white border-b border-gray-200 px-4 sm:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-gray-700 font-medium text-sm mr-4">Atalhos:</span>
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200/60 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all duration-200 whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Page Content */}
          <div className="p-4 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}