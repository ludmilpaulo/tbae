'use client'

import React, { useEffect, useState } from 'react'
import { Panel } from '@/components/ui/Panel'
import { Modal } from '@/components/ui/Modal'
import { ToolbarButton } from '@/components/ui/ToolbarButton'
import { AutoForm } from '@/components/admin/AutoForm'
import { DataTable } from '@/components/admin/DataTable'
import type { Resource } from '@/types/admin'
import { apiBase, apiCreate, apiDelete, apiGet, apiUpdate } from '@/lib/api'

export function CrudPage<T extends Record<string, unknown>>({
  resource,
}: {
  resource: Resource<T>
}) {
  const [rows, setRows] = useState<ReadonlyArray<T>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [values, setValues] = useState<Record<string, unknown>>({})

  const idKey = resource.idKey ?? ('id' as keyof T)
  const listURL = `${apiBase()}${resource.endpoint}`

  const isMultipart = resource.form.some((f) => f.type === 'file')

  function toPayload(data: Record<string, unknown>): BodyInit | unknown {
    if (resource.toPayload) return resource.toPayload(data as Partial<T>)
    if (!isMultipart) return data
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v as Blob | string)
    })
    return fd
  }

  async function load(): Promise<void> {
    setLoading(true)
    setError(null)
    try {
      type PageShape = { results?: ReadonlyArray<T> }
      const data = await apiGet<unknown>(listURL)
      const rowsData =
        Array.isArray(data) ? (data as ReadonlyArray<T>) : ((data as PageShape).results ?? [])
      setRows(rowsData)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource.endpoint])

  function onCreate(): void {
    setEditing(null)
    setValues({})
    setOpen(true)
  }

  function onEdit(row: T): void {
    setEditing(row)
    setValues(row as Record<string, unknown>)
    setOpen(true)
  }

  async function onDelete(row: T): Promise<void> {
    if (!confirm('Delete this record?')) return
    await apiDelete(`${listURL}${String(row[idKey])}/`)
    void load()
  }

  async function onSubmit(): Promise<void> {
    const payload = toPayload(values)
    const url = editing ? `${listURL}${String(editing[idKey])}/` : listURL
    const isFD = payload instanceof FormData

    if (editing) {
      await apiUpdate<unknown>(url, payload, isFD)
    } else {
      await apiCreate<unknown>(url, payload, isFD)
    }

    setOpen(false)
    setEditing(null)
    setValues({})
    void load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{resource.title}</h1>
        <div className="flex gap-2">
          <ToolbarButton onClick={() => void load()}>Refresh</ToolbarButton>
          <button onClick={onCreate} className="px-3 py-2 bg-black text-white rounded-xl">
            New
          </button>
        </div>
      </div>

      <Panel title="Records" right={loading ? <span className="text-sm text-gray-500">Loading…</span> : null}>
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <DataTable<T>
          columns={resource.columns}
          rows={rows}
          idKey={idKey}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Panel>

      <Modal
        open={open}
        title={editing ? `Edit ${resource.title}` : `New ${resource.title}`}
        onClose={() => setOpen(false)}
      >
        <AutoForm fields={resource.form} values={values} setValues={setValues} onSubmit={() => void onSubmit()} />
      </Modal>
    </div>
  )
}
