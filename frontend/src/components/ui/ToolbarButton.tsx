import React from 'react'

export function ToolbarButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button onClick={onClick} className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm">
      {children}
    </button>
  )
}
