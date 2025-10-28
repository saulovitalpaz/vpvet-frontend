'use client'

import { useAuth } from '@/contexts/AuthContext'

interface MobileAdminButtonProps {
  onClick: () => void
  className?: string
}

export function MobileAdminButton({ onClick, className = '' }: MobileAdminButtonProps) {
  const { user } = useAuth()

  // Get user initials for avatar
  const userInitials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2) || 'SV'

  return (
    <button
      onClick={onClick}
      className={`
        relative w-11 h-11 min-w-[44px] min-h-[44px]
        bg-emerald-600 hover:bg-emerald-700
        rounded-full flex items-center justify-center
        transition-all duration-200 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        shadow-lg hover:shadow-xl
        ${className}
      `}
      aria-label="Menu do administrador"
    >
      <span className="text-white font-semibold text-sm">
        {userInitials}
      </span>

      {/* Admin indicator with plus sign */}
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm leading-none">+</span>
      </div>
    </button>
  )
}