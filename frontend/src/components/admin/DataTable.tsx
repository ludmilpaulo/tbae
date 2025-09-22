import React from 'react'
import type { ColumnDef } from '@/types/admin'

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  idKey,
  onEdit,
  onDelete,
}: {
  columns: ReadonlyArray<ColumnDef<T>>
  rows: ReadonlyArray<T>
  idKey: keyof T
  onEdit: (row: T) => void
  onDelete: (row: T) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className="text-left text-xs font-semibold text-gray-500 px-3 py-2"
              >
                {c.label ?? String(c.key)}
              </th>
            ))}
            <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = String(row[idKey])
            return (
              <tr key={id} className="bg-white hover:bg-gray-50">
                {columns.map((c) => {
                  const cell = row[c.key]
                  return (
                    <td key={String(c.key)} className="px-3 py-3 text-sm text-gray-800 align-top">
                      {c.render ? c.render(row) : String(cell ?? '')}
                    </td>
                  )
                })}
                <td className="px-3 py-3 text-right">
                  <button
                    className="text-xs px-2 py-1 rounded-lg border mr-2 hover:bg-gray-50"
                    onClick={() => onEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded-lg border hover:bg-red-50 text-red-600 border-red-200"
                    onClick={() => onDelete(row)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
