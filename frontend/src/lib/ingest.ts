import { apiBase } from '@/lib/api'
import type { CreateImportPayload, CreateImportResponse, ImportJob } from '@/types/ingest'

const base = () => `${apiBase()}/ingest/newsletter-imports`

export async function createImportJob(payload: CreateImportPayload): Promise<CreateImportResponse> {
  const fd = new FormData()
  fd.append('file', payload.file)
  if (payload.list !== undefined) fd.append('list_id', String(payload.list))
  if (payload.list_slug) fd.append('list_slug', payload.list_slug)
  if (payload.create_list) fd.append('create_list', 'true')
  if (payload.confirm_all) fd.append('confirm_all', 'true')
  if (payload.dry_run) fd.append('dry_run', 'true')
  if (payload.note) fd.append('note', payload.note)
  const r = await fetch(base() + '/', { method: 'POST', body: fd })
  if (!r.ok) throw new Error(`Create import failed: ${r.status}`)
  return r.json()
}

export async function listImportJobs(limit = 20): Promise<ImportJob[]> {
  const r = await fetch(base() + '/', { cache: 'no-store' })
  if (!r.ok) throw new Error('Failed to list imports')
  const data = await r.json()
  const arr = Array.isArray(data) ? data : (data.results ?? [])
  return arr.slice(0, limit)
}

export async function getImportStatus(id: number): Promise<ImportJob> {
  const r = await fetch(`${base()}/${id}/status/`, { cache: 'no-store' })
  if (!r.ok) throw new Error(`Failed to fetch status for job ${id}`)
  return r.json()
}
