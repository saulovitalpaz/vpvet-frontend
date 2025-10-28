'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { X, ChevronDown } from 'lucide-react'
import {
  Shield,
  Building,
  Users,
  Activity,
  Upload,
  BarChart3,
  LogOut,
  Settings
} from 'lucide-react'

interface AdminBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminBottomSheet({ isOpen, onClose }: AdminBottomSheetProps) {
  const { user, logout } = useAuth()
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Check if user is Dr. Saulo (system owner)
  const isAdmin = user?.is_dr_saulo

  // Get user initials for avatar
  const userInitials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2) || 'SV'

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const deltaY = currentY - startY
    const threshold = 150 // Minimum swipe distance to dismiss

    if (deltaY > threshold) {
      onClose()
    }

    // Reset position
    setCurrentY(0)
  }

  const transform = isDragging ? `translateY(${Math.max(0, currentY - startY)}px)` : 'translateY(0)'

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        style={{ opacity: isDragging ? 0.8 : 1 }}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transition-transform duration-300 max-h-[85vh] overflow-hidden"
        style={{
          transform,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="overflow-y-auto max-h-[calc(85vh-60px)]"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-base">
                    {userInitials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.name || 'Dr. Saulo'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isAdmin ? 'Administrador' : 'Secretário(a)'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-6 py-4">
            {isAdmin && (
              <>
                {/* Admin Section */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Administração
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/admin"
                      className="flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group min-h-[48px]"
                      onClick={onClose}
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Shield className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-emerald-700">
                          Painel Administrativo
                        </p>
                        <p className="text-sm text-gray-500">Visão geral do sistema</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/clinics"
                      className="flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group min-h-[48px]"
                      onClick={onClose}
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Building className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-emerald-700">
                          Gerenciar Clínicas
                        </p>
                        <p className="text-sm text-gray-500">Configurações das clínicas</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/users"
                      className="flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group min-h-[48px]"
                      onClick={onClose}
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-emerald-700">
                          Gerenciar Usuários
                        </p>
                        <p className="text-sm text-gray-500">Administrar contas</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/clients"
                      className="flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group min-h-[48px]"
                      onClick={onClose}
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Activity className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-emerald-700">
                          Gerenciar Clientes
                        </p>
                        <p className="text-sm text-gray-500">Cadastro de pacientes</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/uploads"
                      className="flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group min-h-[48px]"
                      onClick={onClose}
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Upload className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-emerald-700">
                          Upload de Exames
                        </p>
                        <p className="text-sm text-gray-500">Envio de arquivos</p>
                      </div>
                    </Link>

                    <Link
                      href="/admin/analytics"
                      className="flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition-all duration-200 group min-h-[48px]"
                      onClick={onClose}
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <BarChart3 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-emerald-700">
                          Análises e Métricas
                        </p>
                        <p className="text-sm text-gray-500">Estatísticas do sistema</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>
              </>
            )}

            {/* Regular Actions Section */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Ações
              </h3>
              <div className="space-y-2">
                <Link
                  href="/configuracoes"
                  className="flex items-center gap-4 px-4 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group min-h-[48px]"
                  onClick={onClose}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Configurações</p>
                    <p className="text-sm text-gray-500">Preferências do sistema</p>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    logout()
                    onClose()
                  }}
                  className="w-full flex items-center gap-4 px-4 py-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 group min-h-[48px]"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-red-700 group-hover:text-red-800">
                      {isAdmin ? 'Sair do Sistema' : 'Sair'}
                    </p>
                    <p className="text-sm text-red-500">Encerrar sessão</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}