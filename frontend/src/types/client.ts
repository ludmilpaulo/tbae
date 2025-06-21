// src/types/client.ts
export interface Client {
  id: number;
  name: string;
  logo: string;  // This will be a media URL
  website?: string;
  order: number;
}
