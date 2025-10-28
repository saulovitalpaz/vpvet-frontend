'use client'

import React, { ReactNode, useRef, useEffect, useState } from 'react'
import { useTooltip } from './TooltipContext'

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error' | 'default'
  size?: 'sm' | 'md' | 'lg'
  delay?: number
  disabled?: boolean
  className?: string
  trigger?: 'hover' | 'click' | 'focus'
}

export function Tooltip({
  children,
  content,
  variant = 'default',
  size = 'md',
  delay = 300,
  disabled = false,
  className = '',
  trigger = 'hover'
}: TooltipProps) {
  const { showTooltip, hideTooltip } = useTooltip()
  const triggerRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [isTouch, setIsTouch] = useState(false)

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }

    checkTouch()
    window.addEventListener('touchstart', checkTouch, { once: true })

    return () => {
      window.removeEventListener('touchstart', checkTouch)
    }
  }, [])

  // Adjust trigger for mobile devices
  const effectiveTrigger = isTouch ? 'click' : trigger

  const calculatePosition = () => {
    if (!triggerRef.current) return { x: 0, y: 0 }

    const rect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate center position of trigger element
    let x = rect.left + rect.width / 2
    let y = rect.top

    // Adjust horizontal position if tooltip would go off-screen
    const tooltipWidth = 280 // approximate max width (max-w-xs)
    const tooltipHeight = 80 // approximate height

    if (x - tooltipWidth / 2 < 8) {
      // Too far left
      x = tooltipWidth / 2 + 8
    } else if (x + tooltipWidth / 2 > viewportWidth - 8) {
      // Too far right
      x = viewportWidth - tooltipWidth / 2 - 8
    }

    // Adjust vertical position if tooltip would go off-screen
    if (y - tooltipHeight < 8) {
      // Too close to top, show below instead
      y = rect.bottom + tooltipHeight / 2 + 8
    }

    return { x, y }
  }

  const handleShow = () => {
    if (disabled || !content) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (effectiveTrigger === 'hover' || effectiveTrigger === 'focus') {
      timeoutRef.current = setTimeout(() => {
        const position = calculatePosition()
        showTooltip({
          content,
          position,
          variant,
          size
        })
      }, delay)
    } else if (effectiveTrigger === 'click') {
      const position = calculatePosition()
      showTooltip({
        content,
        position,
        variant,
        size
      })
    }
  }

  const handleHide = () => {
    if (disabled) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (effectiveTrigger === 'hover' || effectiveTrigger === 'focus') {
      hideTooltip()
    }
    // For click trigger, we don't hide on mouse leave (only on click outside or escape)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (effectiveTrigger === 'click') {
      e.preventDefault()
      e.stopPropagation()

      // Toggle tooltip visibility
      const isVisible = false // We don't have access to current state, so we'll just show
      handleShow()
    }
  }

  const handleFocus = (e: React.FocusEvent) => {
    if (effectiveTrigger === 'focus') {
      handleShow()
    }
  }

  const handleBlur = () => {
    if (effectiveTrigger === 'focus') {
      handleHide()
    }
  }

  // Clone the child element and add event handlers
  const enhancedChild = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ref: triggerRef,
        className: `${child.props.className || ''} ${className}`.trim(),
        onMouseEnter: effectiveTrigger === 'hover' ? handleShow : undefined,
        onMouseLeave: effectiveTrigger === 'hover' ? handleHide : undefined,
        onClick: effectiveTrigger === 'click' ? handleClick : child.props.onClick,
        onFocus: effectiveTrigger === 'focus' ? handleFocus : child.props.onFocus,
        onBlur: effectiveTrigger === 'focus' ? handleBlur : child.props.onBlur,
        'aria-describedby': content ? 'tooltip-content' : undefined,
        'aria-label': typeof content === 'string' ? content : undefined,
      } as any)
    }
    return child
  })

  return <>{enhancedChild}</>
}