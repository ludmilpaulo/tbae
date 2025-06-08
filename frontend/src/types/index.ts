export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  company: string;
  image?: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt?: string;
}

export interface AboutData {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface HomepageData {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  testimonials: Testimonial[];
}
