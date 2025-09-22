'use client'

import React, { useMemo } from 'react'
import type { MenuItem, MenuItemKey } from '@/types/admin'
import { classNames } from '@/components/ui/classNames'

export function Sidebar({
  items,
  current,
  onPick,
}: {
  items: ReadonlyArray<MenuItem>
  current: MenuItemKey
  onPick: (k: MenuItemKey) => void
}) {
  const groups = useMemo(() => {
    const m = new Map<string, ReadonlyArray<MenuItem>>()
    const tmp = new Map<string, MenuItem[]>()
    items.forEach((it) => {
      const g = it.group ?? 'General'
      if (!tmp.has(g)) tmp.set(g, [])
      tmp.get(g)!.push(it)
    })
    tmp.forEach((v, k) => m.set(k, v))
    return m
  }, [items])

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r p-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600" />
        <div>
          <div className="font-bold">TBAE Admin</div>
          <div className="text-xs text-gray-500">Next.js + Django</div>
        </div>
      </div>

      {[...groups.entries()].map(([group, arr]) => (
        <div key={group} className="mb-6">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">{group}</div>
          <nav className="space-y-1">
            {arr.map((it) => (
              <button
                key={it.key}
                onClick={() => onPick(it.key)}
                className={classNames(
                  'w-full text-left px-3 py-2 rounded-xl',
                  current === it.key ? 'bg-black text-white' : 'hover:bg-gray-100',
                )}
              >
                {it.label}
              </button>
            ))}
          </nav>
        </div>
      ))}

      <div className="text-xs text-gray-400 mt-8">© {new Date().getFullYear()} TBAE</div>
    </aside>
  )
}
