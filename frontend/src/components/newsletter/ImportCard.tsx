'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ImportJob } from '@/types/ingest'
import { createImportJob, getImportStatus, listImportJobs } from '@/lib/ingest'
import { fmtDate, progressPercent } from '@/lib/format'
import { Badge } from '@/components/ui/Badge'

type LiveState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'tracking'; job: ImportJob }
  | { phase: 'completed'; job: ImportJob }
  | { phase: 'failed'; error: string; job?: ImportJob }

export function ImportCard() {
  const [file, setFile] = useState<File | null>(null)
  const [listId, setListId] = useState<string>('')
  const [listSlug, setListSlug] = useState<string>('')
  const [createList, setCreateList] = useState<boolean>(true)
  const [confirmAll, setConfirmAll] = useState<boolean>(true)
  const [dryRun, setDryRun] = useState<boolean>(false)
  const [note, setNote] = useState<string>('')

  const [live, setLive] = useState<LiveState>({ phase: 'idle' })
  const [history, setHistory] = useState<ImportJob[]>([])
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false)

  const dropRef = useRef<HTMLDivElement>(null)
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }, [])
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => e.preventDefault(), [])

  async function handleSubmit() {
    if (!file) { alert('Please choose a CSV file.'); return }
    setLive({ phase: 'submitting' })
    try {
      const res = await createImportJob({
        file,
        list: listId ? Number(listId) : undefined,
        list_slug: listSlug || undefined,
        create_list: createList,
        confirm_all: confirmAll,
        dry_run: dryRun,
        note: note || undefined,
      })
      setLive({ phase: 'tracking', job: res.job })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create import'
      setLive({ phase: 'failed', error: msg })
    }
  }

  useEffect(() => {
    if (live.phase !== 'tracking') return
    let stop = false
    const id = setInterval(async () => {
      try {
        const next = await getImportStatus(live.job.id)
        if (stop) return
        if (next.status === 'completed' || next.status === 'failed') {
          setLive({ phase: next.status === 'completed' ? 'completed' : 'failed', job: next, error: next.status === 'failed' ? 'Import failed' : undefined as never })
          void refreshHistory()
          clearInterval(id)
        } else {
          setLive({ phase: 'tracking', job: next })
        }
      } catch {
        setLive({ phase: 'failed', error: 'Polling error', job: live.job })
        clearInterval(id)
      }
    }, 1200)
    return () => { stop = true; clearInterval(id) }
  }, [live])

  async function refreshHistory() {
    setLoadingHistory(true)
    try {
      setHistory(await listImportJobs(20))
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => { void refreshHistory() }, [])

  const progress = useMemo(() => {
    if (live.phase === 'tracking' || live.phase === 'completed' || (live.phase === 'failed' && live.job)) {
      const j = live.job
      return progressPercent(j.rows_total, j.rows_created, j.rows_updated, j.rows_skipped, j.rows_errors)
    }
    return 0
  }, [live])

  const busy = live.phase === 'submitting' || live.phase === 'tracking'

  return (
    <div className="bg-white border rounded-2xl shadow-soft p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Import Subscribers</h3>
          <p className="text-sm text-gray-600">
            Upload a CSV with headers at least <code className="bg-gray-50 px-1 rounded">email</code>. You can
            set list by <code className="bg-gray-50 px-1 rounded">list_id</code>, <code className="bg-gray-50 px-1 rounded">list_slug</code>, or override below.
          </p>
        </div>
        <Badge tone="gray">CSV only</Badge>
      </div>

      <div ref={dropRef} onDrop={onDrop} onDragOver={onDragOver} className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50 transition p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
            <div>
              <div className="font-medium">{file ? file.name : 'Drag & drop your CSV here'}</div>
              <div className="text-xs text-gray-500">or click the button to choose a file</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="px-4 py-2 rounded-xl border cursor-pointer hover:bg-gray-50">
              Choose file
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
            </label>
            <button disabled={!file || busy} onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">
              {busy ? 'Uploading…' : 'Start Import'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm text-gray-600">List ID (optional)</span>
          <input inputMode="numeric" value={listId} onChange={(e) => setListId(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="e.g. 3" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">List Slug (optional)</span>
          <input value={listSlug} onChange={(e) => setListSlug(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="e.g. corporate" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Note (optional)</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="e.g. CRM export Sep 2025" />
        </label>
        <div className="flex items-end gap-6 md:col-span-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={createList} onChange={(e) => setCreateList(e.target.checked)} />
            <span className="text-sm text-gray-700">Create list if missing</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={confirmAll} onChange={(e) => setConfirmAll(e.target.checked)} />
            <span className="text-sm text-gray-700">Confirm all</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
            <span className="text-sm text-gray-700">Dry-run (validate only)</span>
          </label>
        </div>
      </div>

      {(live.phase === 'tracking' || live.phase === 'completed' || (live.phase === 'failed' && live.job)) && (
        <div className="rounded-2xl border p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Import Status</div>
            <div className="text-sm text-gray-500">Created: {fmtDate((live as Extract<LiveState, { job: ImportJob }>).job.created_at)}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-2 bg-black rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-gray-600 w-10 text-right">{progress}%</div>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            {(['rows_total','rows_created','rows_updated','rows_skipped','rows_errors'] as const).map((k) => {
              const j = (live as Extract<LiveState, { job: ImportJob }>).job
              return (
                <div key={k} className="bg-gray-50 rounded-xl p-2">
                  <div className="text-[11px] uppercase text-gray-500 tracking-wide">{k.replace('rows_', '')}</div>
                  <div className="font-semibold">{j[k]}</div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-500 mr-2">Status:</span>
              <Badge tone={((s) => s === 'completed' ? 'green' : s === 'failed' ? 'red' : 'blue')((live as Extract<LiveState, { job: ImportJob }>).job.status)}>
                {(live as Extract<LiveState, { job: ImportJob }>).job.status}
              </Badge>
            </div>
            {(live as Extract<LiveState, { job: ImportJob }>).job.error_report ? (
              <a className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm" href={(live as Extract<LiveState, { job: ImportJob }>).job.error_report ?? ''} target="_blank" rel="noreferrer">
                Download Errors CSV
              </a>
            ) : <span className="text-xs text-gray-400">—</span>}
          </div>
        </div>
      )}

      {live.phase === 'failed' && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-3 text-sm">{live.error}</div>
      )}

      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Recent Imports</div>
          <button onClick={() => void refreshHistory()} className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm disabled:opacity-50" disabled={loadingHistory}>
            {loadingHistory ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        {history.length === 0 ? (
          <div className="text-sm text-gray-500">No import history yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Created</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-2">Progress</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2">Results</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-3 py-2">Report</th>
                </tr>
              </thead>
              <tbody>
                {history.map((j) => {
                  const pct = progressPercent(j.rows_total, j.rows_created, j.rows_updated, j.rows_skipped, j.rows_errors)
                  return (
                    <tr key={j.id} className="bg-white hover:bg-gray-50">
                      <td className="px-3 py-3 text-sm">#{j.id}</td>
                      <td className="px-3 py-3 text-sm"><Badge tone={j.status === 'completed' ? 'green' : j.status === 'failed' ? 'red' : 'blue'}>{j.status}</Badge></td>
                      <td className="px-3 py-3 text-sm">{fmtDate(j.created_at)}</td>
                      <td className="px-3 py-3 text-sm">
                        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-2 bg-black rounded-full" style={{ width: `${pct}%` }} /></div>
                        <div className="text-[11px] text-gray-500 mt-1">{pct}%</div>
                      </td>
                      <td className="px-3 py-3 text-sm text-right">
                        <div className="space-x-2">
                          <span className="text-green-700">+{j.rows_created}</span>
                          <span className="text-blue-700">~{j.rows_updated}</span>
                          <span className="text-gray-500">•{j.rows_skipped}</span>
                          <span className="text-red-600">!{j.rows_errors}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-right">
                        {j.error_report ? (
                          <a href={j.error_report} className="text-xs px-2 py-1 rounded-lg border hover:bg-gray-50" target="_blank" rel="noreferrer">Download</a>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
