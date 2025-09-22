import React from 'react'
import type { FieldDef } from '@/types/admin'

export function AutoForm({
  fields,
  values,
  setValues,
  onSubmit,
  submitLabel,
}: {
  fields: ReadonlyArray<FieldDef>
  values: Record<string, unknown>
  setValues: (v: Record<string, unknown>) => void
  onSubmit: () => void
  submitLabel?: string
}) {
  function set(name: string, v: unknown) {
    setValues({ ...values, [name]: v })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {fields.map((f) => {
        const label = f.label ?? f.name
        const raw = values[f.name]
        const isChecked = f.type === 'checkbox' ? Boolean(raw) : undefined
        const val =
          f.type === 'checkbox'
            ? undefined
            : typeof raw === 'string' || typeof raw === 'number'
            ? raw
            : ''

        if (f.type === 'textarea') {
          return (
            <label key={f.name} className="block col-span-2">
              <span className="text-sm text-gray-600">{label}</span>
              <textarea
                className="mt-1 w-full rounded-xl border px-3 py-2"
                placeholder={f.placeholder}
                required={Boolean(f.required)}
                value={String(val)}
                onChange={(e) => set(f.name, e.target.value)}
              />
            </label>
          )
        }

        if (f.type === 'select') {
          return (
            <label key={f.name} className="block">
              <span className="text-sm text-gray-600">{label}</span>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
                value={String(val)}
                onChange={(e) => set(f.name, e.target.value)}
              >
                <option value="">— select —</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          )
        }

        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className="block">
              <span className="text-sm text-gray-600">{label}</span>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={Boolean(isChecked)}
                  onChange={(e) => set(f.name, e.target.checked)}
                />
              </div>
            </label>
          )
        }

        if (f.type === 'file') {
          return (
            <label key={f.name} className="block">
              <span className="text-sm text-gray-600">{label}</span>
              <input
                type="file"
                className="mt-1 w-full rounded-xl border px-3 py-2"
                onChange={(e) => set(f.name, e.target.files?.[0] ?? null)}
              />
            </label>
          )
        }

        return (
          <label key={f.name} className="block">
            <span className="text-sm text-gray-600">{label}</span>
            <input
              type={f.type ?? 'text'}
              className="mt-1 w-full rounded-xl border px-3 py-2"
              placeholder={f.placeholder}
              required={Boolean(f.required)}
              readOnly={f.readOnly}
              value={String(val)}
              onChange={(e) => set(f.name, e.target.value)}
            />
          </label>
        )
      })}

      <div className="col-span-2 flex justify-end mt-4">
        <button className="bg-black text-white px-4 py-2 rounded-xl">
          {submitLabel ?? 'Save'}
        </button>
      </div>
    </form>
  )
}
