export interface GalleryCategory {
  id: number;
  name: string;
  display_name: string;
}

export interface GalleryPhoto {
  id: number;
  image: string;
  caption?: string;
  order: number;
}

export interface GalleryVideo {
  id: number;
  youtube_url: string;
  caption?: string;
  order: number;
}

export interface GalleryEvent {
  id: number;
  title: string;
  description: string;
  event_type: string;
  category: GalleryCategory | null;
  year: number;
  date?: string;
  tags?: string;
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
}
