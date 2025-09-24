'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { CampaignRow, ListRow, SubscriberRow } from '@/types/newsletter'
import { listCampaigns, listLists, listSubscribersByList, sendCampaign } from '@/lib/newsletter'
import { Badge } from '@/components/ui/Badge'

function SubscriberChip({
  s,
  checked,
  onToggle,
}: {
  s: SubscriberRow
  checked: boolean
  onToggle: (id: number) => void
}) {
  const name = [s.first_name, s.last_name].filter(Boolean).join(' ') || s.email
  return (
    <label
      className={`flex items-center justify-between gap-3 px-3 py-2 border rounded-xl ${
        checked ? 'bg-gray-50' : 'bg-white'
      } hover:bg-gray-50`}
    >
      <div className="truncate">
        <div className="font-medium truncate">{name}</div>
        <div className="text-xs text-gray-500 truncate">{s.email}</div>
      </div>
      <input
        type="checkbox"
        className="h-4 w-4"
        checked={checked}
        onChange={() => onToggle(s.id)}
      />
    </label>
  )
}

export function SendCampaignCard() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
  const [lists, setLists] = useState<ListRow[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<number | ''>('')
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([])
  const [mode, setMode] = useState<'all' | 'selected'>('all')
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [loadingSubs, setLoadingSubs] = useState(false)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function init() {
      const [cs, ls] = await Promise.all([listCampaigns(), listLists()])
      setCampaigns(cs)
      setLists(ls)
    }
    void init()
  }, [])

  const current = useMemo(
    () => campaigns.find((c) => c.id === Number(selectedCampaign)),
    [campaigns, selectedCampaign],
  )
  const listOfCampaign = useMemo(
    () => lists.find((l) => l.id === (current?.list ?? -1)),
    [lists, current],
  )

  useEffect(() => {
    async function loadSubs() {
      if (!current) {
        setSubscribers([])
        setPicked(new Set())
        return
      }
      setLoadingSubs(true)
      try {
        const data = await listSubscribersByList(current.list)
        setSubscribers(data)
      } finally {
        setLoadingSubs(false)
      }
    }
    void loadSubs()
  }, [current])

  function togglePick(id: number) {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function selectAll(v: boolean) {
    setPicked(v ? new Set(subscribers.map((s) => s.id)) : new Set())
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return subscribers
    return subscribers.filter(
      (s) =>
        s.email?.toLowerCase().includes(q) ||
        (s.first_name && s.first_name.toLowerCase().includes(q)) ||
        (s.last_name && s.last_name.toLowerCase().includes(q)),
    )
  }, [search, subscribers])

  async function onSend() {
    if (!current) {
      alert('Choose a campaign first.')
      return
    }
    if (mode === 'selected' && picked.size === 0) {
      alert('Pick at least one subscriber or switch to "All".')
      return
    }
    setSending(true)
    try {
      const ids = mode === 'selected' ? Array.from(picked) : undefined
      const res = await sendCampaign(current.id, mode, ids)
      alert(`Campaign queued${res.enqueued ? ' (async)' : ''}. ID #${res.campaign_id}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white border rounded-2xl shadow-soft p-5 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Send Campaign</h3>
          <p className="text-sm text-gray-600">
            Choose a campaign, then send to all or selected subscribers from its list.
          </p>
        </div>
        {current?.status ? (
          <Badge tone={current.status === 'sent' ? 'green' : 'gray'}>{current.status}</Badge>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-sm text-gray-600">Campaign</span>
          <select
            className="mt-1 w-full rounded-xl border px-3 py-2 bg-white"
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">— select campaign —</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.id} — {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">List</span>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 bg-gray-50"
            value={listOfCampaign ? `${listOfCampaign.name} (id=${listOfCampaign.id})` : '—'}
            readOnly
          />
        </label>
        <div className="flex items-end gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="all"
              checked={mode === 'all'}
              onChange={() => setMode('all')}
            />
            <span className="text-sm text-gray-700">Send to all</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="selected"
              checked={mode === 'selected'}
              onChange={() => setMode('selected')}
            />
            <span className="text-sm text-gray-700">Send to selected</span>
          </label>
        </div>
      </div>

      {current && (
        <div className="rounded-2xl border p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="font-medium">Subscribers in list #{current.list}</div>
            <div className="flex items-center gap-2">
              <input
                className="rounded-xl border px-3 py-2 text-sm"
                placeholder="Search name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label className="text-sm inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={picked.size === subscribers.length && subscribers.length > 0}
                  onChange={(e) => selectAll(e.target.checked)}
                  disabled={loadingSubs || subscribers.length === 0}
                />
                Select all
              </label>
            </div>
          </div>

          {loadingSubs ? (
            <div className="text-sm text-gray-500">Loading subscribers…</div>
          ) : subscribers.length === 0 ? (
            <div className="text-sm text-gray-500">No subscribers found for this list.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-96 overflow-auto pr-1">
              {filtered.map((s) => (
                <SubscriberChip key={s.id} s={s} checked={picked.has(s.id)} onToggle={togglePick} />
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <span className="text-sm text-gray-600">
              Selected: {picked.size} / {subscribers.length}
            </span>
            <button
              onClick={onSend}
              disabled={!current || sending || (mode === 'selected' && picked.size === 0)}
              className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
            >
              {sending ? 'Sending…' : mode === 'selected' ? 'Send to selected' : 'Send to all'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
