import { ReactElement } from 'react'
import { ShapeType } from './types'

interface ShapeIconProps {
  type: ShapeType
  size?: number
  className?: string
}

export function ShapeIcon({ type, size = 40, className = '' }: ShapeIconProps) {
  const iconComponents: Record<ShapeType, ReactElement> = {
    hearts: (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path
          d="M50 85 C50 85 15 60 15 40 C15 25 25 15 35 15 C42 15 48 20 50 25 C52 20 58 15 65 15 C75 15 85 25 85 40 C85 60 50 85 50 85 Z"
          fill="#ff4444"
          stroke="#cc0000"
          strokeWidth="2"
        />
      </svg>
    ),
    spades: (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path
          d="M50 15 L65 40 C65 40 75 45 75 55 C75 65 67 70 57 70 C57 70 60 85 50 85 C40 85 43 70 43 70 C33 70 25 65 25 55 C25 45 35 40 35 40 Z"
          fill="#000000"
          stroke="#333333"
          strokeWidth="2"
        />
      </svg>
    ),
    clubs: (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="35" cy="40" r="15" fill="#000000" />
        <circle cx="65" cy="40" r="15" fill="#000000" />
        <circle cx="50" cy="25" r="15" fill="#000000" />
        <path
          d="M45 50 L40 75 L60 75 L55 50 Z"
          fill="#000000"
          stroke="#333333"
          strokeWidth="2"
        />
      </svg>
    ),
    diamonds: (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <path
          d="M50 15 L80 50 L50 85 L20 50 Z"
          fill="#ff4444"
          stroke="#cc0000"
          strokeWidth="2"
        />
      </svg>
    ),
    skocko: (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="35" fill="#4444ff" stroke="#0000cc" strokeWidth="2" />
        <circle cx="40" cy="42" r="6" fill="#ffffff" />
        <circle cx="60" cy="42" r="6" fill="#ffffff" />
        <circle cx="40" cy="42" r="3" fill="#000000" />
        <circle cx="60" cy="42" r="3" fill="#000000" />
        <path
          d="M35 60 Q50 70 65 60"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    fata: (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="35" fill="#ffaa00" stroke="#cc8800" strokeWidth="2" />
        <path
          d="M30 35 L35 40 L40 35"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M60 35 L65 40 L70 35"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="50" cy="65" rx="15" ry="8" fill="#000000" />
        <ellipse cx="50" cy="64" rx="15" ry="6" fill="#ff6666" />
      </svg>
    ),
  }

  return iconComponents[type]
}

export const SHAPE_TYPES: ShapeType[] = ['hearts', 'spades', 'clubs', 'diamonds', 'skocko', 'fata']
