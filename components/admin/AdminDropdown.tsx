'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import {
  Shield,
  Building,
  Users,
  Activity,
  Upload,
  BarChart3,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react'
import { MobileAdminButton } from './MobileAdminButton'
import { AdminBottomSheet } from './AdminBottomSheet'

export function AdminDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if user is Dr. Saulo (system owner)
  const isAdmin = user?.is_dr_saulo

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isAdmin) {
    // If not admin, show regular user menu
    return (
      <>
        <div className="relative" ref={dropdownRef}>
          {/* Desktop version */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden sm:flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SV'}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">Secretário(a)</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link
                href="/configuracoes"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3" />
                Configurações
              </Link>
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sair
              </button>
            </div>
          )}
        </div>

        {/* Mobile version */}
        <div className="sm:hidden">
          <MobileAdminButton onClick={() => setIsMobileOpen(true)} />
          <AdminBottomSheet isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
        </div>
      </>
    )
  }

  // Admin menu for Dr. Saulo
  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Desktop version */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden sm:flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors border border-gray-200/60"
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SV'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || 'Dr. Saulo'}
            </p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            {/* Admin Section */}
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administração</p>
            </div>

            <Link
              href="/admin"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-4 h-4 mr-3 text-emerald-600" />
              <span className="group-hover:font-medium">Painel Administrativo</span>
            </Link>

            <Link
              href="/admin/clinics"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Building className="w-4 h-4 mr-3 text-emerald-600" />
              <span className="group-hover:font-medium">Gerenciar Clínicas</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Users className="w-4 h-4 mr-3 text-emerald-600" />
              <span className="group-hover:font-medium">Gerenciar Usuários</span>
            </Link>

            <Link
              href="/admin/clients"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Activity className="w-4 h-4 mr-3 text-emerald-600" />
              <span className="group-hover:font-medium">Gerenciar Clientes</span>
            </Link>

            <Link
              href="/admin/uploads"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Upload className="w-4 h-4 mr-3 text-emerald-600" />
              <span className="group-hover:font-medium">Upload de Exames</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="w-4 h-4 mr-3 text-emerald-600" />
              <span className="group-hover:font-medium">Análises e Métricas</span>
            </Link>

            {/* Divider */}
            <div className="my-2 border-t border-gray-100"></div>

            {/* Regular user menu items */}
            <Link
              href="/configuracoes"
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3" />
              Configurações
            </Link>

            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair do Sistema
            </button>
          </div>
        )}
      </div>

      {/* Mobile version */}
      <div className="sm:hidden">
        <MobileAdminButton onClick={() => setIsMobileOpen(true)} />
        <AdminBottomSheet isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
      </div>
    </>
  )
}