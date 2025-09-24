'use client'

import React, { useState } from 'react'
import type { MenuItem, MenuItemKey, Resource } from '@/types/admin'
import { Sidebar } from '@/components/admin/Sidebar'
import { CrudPage } from '@/components/admin/CrudPage'
import { apiBase } from '@/lib/api'
import { ImportCard } from '@/components/newsletter/ImportCard'
import { SendCampaignCard } from '@/components/newsletter/SendCampaignCard'


// ---- Resource Row Shapes (minimal keys you display/edit) ----
type ActivityCategoryRow = { id: number; name: string; order?: number }
type ActivityRow = {
  id: number
  title: string
  slug?: string
  is_premium?: boolean
  order?: number
  short_description?: string
  description?: string
  duration?: string
  physical_intensity?: string
  main_outcomes?: string
  category?: number
  brochure_page?: number
  image?: string
}
type BrochureRow = { id: number; file: string; version?: string; uploaded_at?: string }
type ProvinceRow = { id: number; name: string }
type TownRow = { id: number; name: string; province: number }
type VenueRow = {
  id: number
  name: string
  province: number
  town: number
  price?: number
  description?: string
  details?: string
  latitude?: number
  longitude?: number
}
type VenueImageRow = { id: number; venue: number; image: string; caption?: string; order?: number }
type BookingRow = {
  id: number
  venue: number
  name: string
  email: string
  phone?: string
  group_size: number
  check_in: string
  check_out: string
  message?: string
  total_price?: number
  confirmed?: boolean
}
type ListRow = { id: number; name: string; slug?: string }
type SubscriberRow = {
  id: number
  list: number
  email: string
  first_name?: string
  last_name?: string
  tags?: unknown
  is_confirmed?: boolean
}
type TemplateRow = { id: number; name: string; subject: string; html?: string }
type CampaignRow = {
  id: number
  name: string
  list: number
  template: number
  status?: string
  from_email?: string
  scheduled_at?: string
}

// ---- Resources config ----
const resources: ReadonlyArray<
  Resource<
    | ActivityCategoryRow
    | ActivityRow
    | BrochureRow
    | ProvinceRow
    | TownRow
    | VenueRow
    | VenueImageRow
    | BookingRow
    | ListRow
    | SubscriberRow
    | TemplateRow
    | CampaignRow
  >
> = [
  {
    key: 'activity_categories',
    title: 'Activity Categories',
    endpoint: '/activity/categories/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'order', label: 'Order' },
    ],
    form: [
      { name: 'name', required: true },
      { name: 'order', type: 'number' },
    ],
  },
  {
    key: 'activities',
    title: 'Activities',
    endpoint: '/activities/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'is_premium', label: 'Premium' },
      { key: 'order', label: 'Order' },
    ],
    form: [
      { name: 'title', required: true },
      { name: 'slug' },
      { name: 'short_description', type: 'textarea' },
      { name: 'description', type: 'textarea' },
      { name: 'duration' },
      { name: 'physical_intensity' },
      { name: 'main_outcomes' },
      { name: 'category', label: 'Category ID', type: 'number' },
      { name: 'is_premium', type: 'checkbox' },
      { name: 'brochure_page', type: 'number' },
      { name: 'order', type: 'number' },
      { name: 'image', type: 'file' },
    ],
  },
  {
    key: 'brochures',
    title: 'Brochures',
    endpoint: '/brochures/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'file', label: 'File' },
      { key: 'version', label: 'Version' },
      { key: 'uploaded_at', label: 'Uploaded' },
    ],
    form: [
      { name: 'file', type: 'file', required: true },
      { name: 'version' },
    ],
  },

  // Venues
  {
    key: 'provinces',
    title: 'Provinces',
    endpoint: '/provinces/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
    ],
    form: [{ name: 'name', required: true }],
  },
  {
    key: 'towns',
    title: 'Towns',
    endpoint: '/towns/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'province', label: 'Province ID' },
    ],
    form: [
      { name: 'name', required: true },
      { name: 'province', label: 'Province ID', type: 'number', required: true },
    ],
  },
  {
    key: 'venues',
    title: 'Venues',
    endpoint: '/venues/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'province', label: 'Province ID' },
      { key: 'town', label: 'Town ID' },
      { key: 'price', label: 'Price' },
    ],
    form: [
      { name: 'name', required: true },
      { name: 'province', label: 'Province ID', type: 'number', required: true },
      { name: 'town', label: 'Town ID', type: 'number', required: true },
      { name: 'price', type: 'number' },
      { name: 'description', type: 'textarea' },
      { name: 'details', type: 'textarea' },
      { name: 'latitude', type: 'number' },
      { name: 'longitude', type: 'number' },
    ],
  },
  {
    key: 'venue_images',
    title: 'Venue Images',
    endpoint: '/venueimages/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'venue', label: 'Venue ID' },
      { key: 'image', label: 'Image' },
      { key: 'caption', label: 'Caption' },
      { key: 'order', label: 'Order' },
    ],
    form: [
      { name: 'venue', label: 'Venue ID', type: 'number', required: true },
      { name: 'image', type: 'file', required: true },
      { name: 'caption' },
      { name: 'order', type: 'number' },
    ],
  },

  // Bookings
  {
    key: 'bookings',
    title: 'Bookings',
    endpoint: '/bookings/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'venue', label: 'Venue ID' },
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'group_size', label: 'Group' },
      { key: 'check_in', label: 'Check-in' },
      { key: 'check_out', label: 'Check-out' },
      { key: 'confirmed', label: 'Confirmed' },
    ],
    form: [
      { name: 'venue', label: 'Venue ID', type: 'number', required: true },
      { name: 'name', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'phone' },
      { name: 'group_size', type: 'number', required: true },
      { name: 'check_in', type: 'date', required: true },
      { name: 'check_out', type: 'date', required: true },
      { name: 'message', type: 'textarea' },
      { name: 'total_price', type: 'number' },
      { name: 'confirmed', type: 'checkbox' },
    ],
  },

  // Newsletter
  {
    key: 'nl_lists',
    title: 'Mailing Lists',
    endpoint: '/n/lists/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
    ],
    form: [
      { name: 'name', required: true },
      { name: 'slug' },
    ],
  },
  {
    key: 'nl_subscribers',
    title: 'Subscribers',
    endpoint: '/n/subscribers/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'list', label: 'List ID' },
      { key: 'email', label: 'Email' },
      { key: 'first_name', label: 'First' },
      { key: 'last_name', label: 'Last' },
      { key: 'is_confirmed', label: 'Confirmed' },
    ],
    form: [
      { name: 'list', label: 'List ID', type: 'number', required: true },
      { name: 'email', type: 'email', required: true },
      { name: 'first_name' },
      { name: 'last_name' },
      { name: 'tags' },
      { name: 'is_confirmed', type: 'checkbox' },
    ],
  },
  {
    key: 'nl_templates',
    title: 'Templates',
    endpoint: '/n/templates/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'subject', label: 'Subject' },
    ],
    form: [
      { name: 'name', required: true },
      { name: 'subject', required: true },
      { name: 'html', label: 'HTML', type: 'textarea', required: true },
    ],
  },
  {
    key: 'nl_campaigns',
    title: 'Campaigns',
    endpoint: '/n/campaigns/',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'list', label: 'List ID' },
      { key: 'template', label: 'Template ID' },
      { key: 'status', label: 'Status' },
    ],
    form: [
      { name: 'name', required: true },
      { name: 'from_email', required: true },
      { name: 'list', label: 'List ID', type: 'number', required: true },
      { name: 'template', label: 'Template ID', type: 'number', required: true },
      { name: 'scheduled_at', type: 'text', placeholder: 'YYYY-MM-DDTHH:mm:ssZ' },
    ],
  },
]

// ---- Menu ----
const menu: ReadonlyArray<MenuItem> = [
  { key: 'activity_categories', label: 'Activity Categories', group: 'Activities' },
  { key: 'activities', label: 'Activities', group: 'Activities' },
  { key: 'brochures', label: 'Brochures', group: 'Activities' },

  { key: 'provinces', label: 'Provinces', group: 'Venues' },
  { key: 'towns', label: 'Towns', group: 'Venues' },
  { key: 'venues', label: 'Venues', group: 'Venues' },
  { key: 'venue_images', label: 'Venue Images', group: 'Venues' },

  { key: 'bookings', label: 'Bookings', group: 'Bookings' },

  { key: 'nl_lists', label: 'Lists', group: 'Newsletter' },
  { key: 'nl_subscribers', label: 'Subscribers', group: 'Newsletter' },
  { key: 'nl_templates', label: 'Templates', group: 'Newsletter' },
  { key: 'nl_campaigns', label: 'Campaigns', group: 'Newsletter' },
]

export default function AdminPage() {
  const [current, setCurrent] = useState<MenuItemKey>(menu[0].key)

  const res = resources.find((r) => r.key === current)
  if (!res) return null

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="flex">
        <Sidebar items={menu} current={current} onPick={setCurrent} />
        <main className="flex-1 p-6 lg:p-10 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{res.title}</h1>
              <p className="text-gray-500">Manage {res.title.toLowerCase()} via your Django API</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-500">API:</span>
              <code className="bg-white border px-2 py-1 rounded-xl text-xs">
                {apiBase()}
                {res.endpoint}
              </code>
            </div>
          </header>

           {/* Import card only on Subscribers */}
        {current === 'nl_subscribers' && <ImportCard />}
{current === 'nl_campaigns' && <SendCampaignCard />}

          {/* Generic CRUD for current resource */}
          <CrudPage resource={res} />
        </main>
      </div>
    </div>
  )
}
