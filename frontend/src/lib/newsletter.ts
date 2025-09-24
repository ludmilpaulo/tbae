'use client'

import type {
  ListRow,
  SubscriberRow,
  TemplateRow,
  CampaignRow,
} from "@/types/newsletter";

const API = "https://africarise.pythonanywhere.com/n"

async function json<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const msg = await r.text()
    throw new Error(msg || `HTTP ${r.status}`)
  }
  return r.json()
}

export async function listLists(): Promise<ListRow[]> {
  const r = await fetch(`${API}/lists/?page_size=1000`, { cache: "no-store", credentials: "include" })
  const data = await r.json()
  return data.results ?? data
}

export async function listCampaigns(): Promise<CampaignRow[]> {
  const r = await fetch(`${API}/campaigns/?page_size=1000`, { cache: "no-store", credentials: "include" })
  const data = await r.json()
  return data.results ?? data
}

export async function listSubscribersByList(listId: number): Promise<SubscriberRow[]> {
  const r = await fetch(`${API}/subscribers/?list=${listId}&is_confirmed=true&page_size=10000`, { cache: "no-store", credentials: "include" })
  const data = await r.json()
  return data.results ?? data
}

export async function createTemplate(payload: { name: string; subject: string; html: string }): Promise<TemplateRow> {
  const r = await fetch(`${API}/templates/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  return json<TemplateRow>(r)
}

export async function createCampaign(payload: {
  name: string
  list: number
  template: number
  from_email: string
  scheduled_at?: string | null
}): Promise<CampaignRow> {
  const r = await fetch(`${API}/campaigns/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: payload.name,
      list: payload.list,
      template: payload.template,
      from_email: payload.from_email,
      scheduled_at: payload.scheduled_at ?? null,
    }),
  })
  return json<CampaignRow>(r)
}

export async function sendCampaign(
  id: number,
  mode: "all" | "selected",
  subscribers?: number[]
): Promise<{ enqueued: boolean; campaign_id: number }> {
  const r = await fetch(`${API}/campaigns/${id}/send/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ mode, subscribers }),
  })
  return json<{ enqueued: boolean; campaign_id: number }>(r)
}
