// src/types/faq.ts

export interface FAQCategory {
  id: number;
  name: string;
  order: number;
}

export interface FAQ {
  id: number;
  category: FAQCategory | null;
  question: string;
  answer: string;
  order: number;
  is_active: boolean;
}
