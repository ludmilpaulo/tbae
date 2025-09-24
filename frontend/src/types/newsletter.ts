// /types/newsletter.ts
export type ListRow = {
  id: number;
  name: string;
  slug: string;
  subscribers_count: number;
};

export type SubscriberRow = {
  id: number;
  list: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  is_confirmed: boolean;
};

export type TemplateRow = {
  id: number;
  name: string;
  subject: string;
  html: string;
  updated_at: string;
};

export type CampaignRow = {
  id: number;
  name: string;
  list: number;
  template: number;
  from_email: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled";
  created_at: string;
  deliveries_count: number;
};

export type ImportJob = {
  id: number;
  list: number;
  status: "pending" | "validating" | "processing" | "completed" | "failed";
  rows_total: number;
  rows_created: number;
  rows_updated: number;
  rows_skipped: number;
  rows_errors: number;
  error_report?: string | null;
  created_at: string;
  started_at?: string | null;
  finished_at?: string | null;
  note?: string | null;
};
