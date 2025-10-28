'use client'

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'

interface TooltipState {
  visible: boolean
  content: ReactNode
  position: { x: number; y: number }
  variant: 'info' | 'success' | 'warning' | 'error' | 'default'
  size: 'sm' | 'md' | 'lg'
}

interface TooltipContextValue {
  showTooltip: (state: Omit<TooltipState, 'visible'>) => void
  hideTooltip: () => void
  tooltipState: TooltipState
}

const TooltipContext = createContext<TooltipContextValue | undefined>(undefined)

export function useTooltip() {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider')
  }
  return context
}

interface TooltipProviderProps {
  children: ReactNode
}

export function TooltipProvider({ children }: TooltipProviderProps) {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    visible: false,
    content: '',
    position: { x: 0, y: 0 },
    variant: 'default',
    size: 'md'
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const tooltipRef = useRef<HTMLDivElement>(null)

  const showTooltip = (state: Omit<TooltipState, 'visible'>) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setTooltipState(prev => ({
      ...prev,
      visible: true,
      ...state
    }))
  }

  const hideTooltip = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Add small delay for smoother UX
    timeoutRef.current = setTimeout(() => {
      setTooltipState(prev => ({
        ...prev,
        visible: false
      }))
    }, 100)
  }

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        hideTooltip()
      }
    }

    if (tooltipState.visible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [tooltipState.visible])

  // Handle escape key to close tooltip
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && tooltipState.visible) {
        hideTooltip()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [tooltipState.visible])

  const value: TooltipContextValue = {
    showTooltip,
    hideTooltip,
    tooltipState
  }

  return (
    <TooltipContext.Provider value={value}>
      {children}
      {/* Global tooltip container */}
      {tooltipState.visible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipState.position.x,
            top: tooltipState.position.y,
            transform: 'translate(-50%, -100%) translateY(-8px)'
          }}
        >
          <div
            className={`
              px-3 py-2 text-sm rounded-md shadow-lg border animate-in fade-in-0 zoom-in-95
              max-w-xs transition-all duration-200 ease-in-out
              ${getTooltipVariantClasses(tooltipState.variant)}
              ${getTooltipSizeClasses(tooltipState.size)}
            `}
            role="tooltip"
            aria-hidden={!tooltipState.visible}
          >
            {tooltipState.content}
            {/* Arrow */}
            <div
              className={`
                absolute w-0 h-0 border-l-4 border-r-4 border-t-4
                transform -translate-x-1/2 left-1/2
                ${getArrowVariantClasses(tooltipState.variant)}
              `}
              style={{
                bottom: '-4px',
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: getArrowColor(tooltipState.variant)
              }}
            />
          </div>
        </div>
      )}
    </TooltipContext.Provider>
  )
}

function getTooltipVariantClasses(variant: TooltipState['variant']) {
  switch (variant) {
    case 'info':
      return 'bg-emerald-800 text-white border-emerald-600'
    case 'success':
      return 'bg-emerald-700 text-white border-emerald-600'
    case 'warning':
      return 'bg-amber-700 text-white border-amber-600'
    case 'error':
      return 'bg-red-700 text-white border-red-600'
    default:
      return 'bg-gray-700 text-gray-50 border-gray-600'
  }
}

function getArrowVariantClasses(variant: TooltipState['variant']) {
  return getTooltipVariantClasses(variant)
}

function getArrowColor(variant: TooltipState['variant']) {
  switch (variant) {
    case 'info':
      return '#065f46' // emerald-800
    case 'success':
      return '#047857' // emerald-700
    case 'warning':
      return '#b45309' // amber-700
    case 'error':
      return '#b91c1c' // red-700
    default:
      return '#374151' // gray-700
  }
}

function getTooltipSizeClasses(size: TooltipState['size']) {
  switch (size) {
    case 'sm':
      return 'text-xs px-2 py-1'
    case 'lg':
      return 'text-base px-4 py-3'
    default:
      return 'text-sm px-3 py-2'
  }
}