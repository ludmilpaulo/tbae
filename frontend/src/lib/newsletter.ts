import { apiBase } from '@/lib/api'
import type { CampaignRow, ListRow, SubscriberRow } from '@/types/newsletter'

const baseN = () => `${apiBase()}/n`

export async function listCampaigns(): Promise<CampaignRow[]> {
  const r = await fetch(`${baseN()}/campaigns/`, { cache: 'no-store' })
  if (!r.ok) throw new Error('Failed to load campaigns')
  const data = await r.json()
  return Array.isArray(data) ? data : (data.results ?? [])
}

export async function listLists(): Promise<ListRow[]> {
  const r = await fetch(`${baseN()}/lists/`, { cache: 'no-store' })
  if (!r.ok) throw new Error('Failed to load lists')
  const data = await r.json()
  return Array.isArray(data) ? data : (data.results ?? [])
}

export async function listSubscribersByList(listId: number): Promise<SubscriberRow[]> {
  const r = await fetch(`${baseN()}/subscribers/?list=${listId}`, { cache: 'no-store' })
  if (!r.ok) throw new Error('Failed to load subscribers')
  const data = await r.json()
  return Array.isArray(data) ? data : (data.results ?? [])
}

export async function sendCampaign(campaignId: number, mode: 'all' | 'selected', subscriberIds?: number[]) {
  const body: { mode: 'all' | 'selected'; subscribers?: number[] } = { mode }
  if (mode === 'selected' && subscriberIds && subscriberIds.length) body.subscribers = subscriberIds
  const r = await fetch(`${baseN()}/campaigns/${campaignId}/send/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const txt = await r.text().catch(() => '')
    throw new Error(`Send failed: ${r.status} ${txt}`)
  }
  return r.json() as Promise<{ enqueued: boolean; campaign_id: number }>
}
