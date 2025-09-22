export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'date'
  | 'checkbox'
  | 'select'
  | 'file'

export type FieldDef = {
  name: string
  label?: string
  type?: FieldType
  required?: boolean
  placeholder?: string
  options?: ReadonlyArray<{ label: string; value: string | number }>
  readOnly?: boolean
}

export type ColumnDef<T extends Record<string, unknown>> = {
  key: keyof T
  label?: string
  render?: (row: T) => React.ReactNode
  width?: string
}

export type Resource<T extends Record<string, unknown>> = {
  key: string
  title: string
  endpoint: string
  idKey?: keyof T
  columns: ReadonlyArray<ColumnDef<T>>
  form: ReadonlyArray<FieldDef>
  toPayload?: (values: Partial<T>) => BodyInit | unknown
}

export type MenuItemKey =
  | 'activity_categories'
  | 'activities'
  | 'brochures'
  | 'provinces'
  | 'towns'
  | 'venues'
  | 'venue_images'
  | 'bookings'
  | 'nl_lists'
  | 'nl_subscribers'
  | 'nl_templates'
  | 'nl_campaigns'

export type MenuItem = {
  key: MenuItemKey
  label: string
  group?: string
}
