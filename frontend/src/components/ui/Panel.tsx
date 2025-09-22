import React from 'react'

export function Panel({
  title,
  children,
  right,
}: {
  title: string
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="bg-white shadow-sm rounded-2xl border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  )
}
