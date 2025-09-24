export type ListRow = { id: number; name: string; slug?: string }
export type SubscriberRow = {
  id: number
  list: number
  email: string
  first_name?: string
  last_name?: string
  is_confirmed?: boolean
}
export type TemplateRow = { id: number; name: string; subject: string; html?: string }
export type CampaignRow = {
  id: number
  name: string
  list: number
  template: number
  status?: string
  from_email?: string
  scheduled_at?: string
}
