export interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  feedback: string;
  avatar: string;  // /media/testimonials/xyz.jpg
  image: string;   // usually same as avatar, keep for legacy
}
