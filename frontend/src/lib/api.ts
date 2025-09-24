const API_BASE ='https://africarise.pythonanywhere.com'

export function apiBase(): string {
  return API_BASE
}

export async function apiGet<T>(url: string): Promise<T> {
  const r = await fetch(url, { cache: 'no-store' })
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}`)
  return (await r.json()) as T
}

export async function apiCreate<T>(
  url: string,
  payload: BodyInit | unknown,
  isFormData: boolean,
): Promise<T> {
  const init: RequestInit = isFormData
    ? { method: 'POST', body: payload as BodyInit }
    : {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      }

  const r = await fetch(url, init)
  if (!r.ok) throw new Error(`POST ${url} -> ${r.status}`)
  return (await r.json()) as T
}

export async function apiUpdate<T>(
  url: string,
  payload: BodyInit | unknown,
  isFormData: boolean,
): Promise<T> {
  const init: RequestInit = isFormData
    ? { method: 'PUT', body: payload as BodyInit }
    : {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      }

  const r = await fetch(url, init)
  if (!r.ok) throw new Error(`PUT ${url} -> ${r.status}`)
  return (await r.json()) as T
}

export async function apiDelete(url: string): Promise<void> {
  const r = await fetch(url, { method: 'DELETE' })
  if (!r.ok) throw new Error(`DELETE ${url} -> ${r.status}`)
}
