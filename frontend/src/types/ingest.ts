export type ImportStatus = 'pending' | 'validating' | 'processing' | 'completed' | 'failed'

export type ImportJob = {
  id: number
  created_at: string
  started_at?: string | null
  finished_at?: string | null
  status: ImportStatus
  file: string
  error_report?: string | null
  list_id?: number | null
  list_slug?: string | null
  create_list: boolean
  confirm_all: boolean
  dry_run: boolean
  note?: string
  rows_total: number
  rows_created: number
  rows_updated: number
  rows_skipped: number
  rows_errors: number
}

export type CreateImportPayload = {
  file: File
  list?: number
  list_slug?: string
  create_list?: boolean
  confirm_all?: boolean
  dry_run?: boolean
  note?: string
}

export type CreateImportResponse = {
  enqueued: boolean
  job: ImportJob
}
