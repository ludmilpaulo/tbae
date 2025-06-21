export interface Province {
  id: number;
  name: string;
}
export interface Town {
  id: number;
  name: string;
  province: Province;
}
export interface VenueImage {
  id: number;
  image: string;
  caption?: string;
}
export interface Venue {
  id: number;
  name: string;
  address: string;
  price:number;
  province: Province;
  town: Town;
  description: string;
  details?: string;
  latitude?: number;
  longitude?: number;
  images: VenueImage[];
}
