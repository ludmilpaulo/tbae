'use client'

import React from 'react'
import type { ImportJob } from '@/types/ingest'
import { fmtDate, progressPercent } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'

function statusTone(status: ImportJob['status']): 'gray' | 'blue' | 'green' | 'red' | 'yellow' {
  switch (status) {
    case 'pending':
      return 'gray'
    case 'validating':
    case 'processing':
      return 'blue'
    case 'completed':
      return 'green'
    case 'failed':
      return 'red'
    default:
      return 'gray'
  }
}

export function ImportHistoryTable({
  jobs,
}: {
  jobs: ReadonlyArray<ImportJob>
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">ID</th>
            <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Status</th>
            <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Created</th>
            <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Started</th>
            <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Finished</th>
            <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Progress</th>
            <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2">Results</th>
            <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2">Report</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => {
            const pct = progressPercent(
              j.rows_total,
              j.rows_created,
              j.rows_updated,
              j.rows_skipped,
              j.rows_errors
            )
            return (
              <tr key={j.id} className="bg-white hover:bg-gray-50">
                <td className="px-3 py-3 text-sm">#{j.id}</td>
                <td className="px-3 py-3 text-sm">
                  <Badge tone={statusTone(j.status)}>{j.status}</Badge>
                </td>
                <td className="px-3 py-3 text-sm">{fmtDate(j.created_at)}</td>
                <td className="px-3 py-3 text-sm">{fmtDate(j.started_at)}</td>
                <td className="px-3 py-3 text-sm">{fmtDate(j.finished_at)}</td>
                <td className="px-3 py-3 text-sm">
                  <div className="w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-black rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">{pct}%</div>
                </td>
                <td className="px-3 py-3 text-sm text-right">
                  <div className="space-x-2">
                    <span title="created" className="text-green-700">+{j.rows_created}</span>
                    <span title="updated" className="text-blue-700">~{j.rows_updated}</span>
                    <span title="skipped" className="text-gray-500">•{j.rows_skipped}</span>
                    <span title="errors" className="text-red-600">!{j.rows_errors}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-sm text-right">
                  {j.error_report ? (
                    <a
                      href={j.error_report}
                      className="text-xs px-2 py-1 rounded-lg border hover:bg-gray-50"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download CSV
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
