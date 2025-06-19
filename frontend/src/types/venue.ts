// types/venue.ts
export type Venue = {
  id: number;
  name: string;
  image: string;
  address: string;
  description?: string;
  region: string;
};

// mock data (replace with API fetch later)
const VENUES: Venue[] = [
  {
    id: 1,
    name: "Cape Town Waterfront",
    image: "/venues/capetown.jpg",
    address: "Waterfront, Cape Town",
    region: "Western Cape",
  },
  {
    id: 2,
    name: "Kimberley Big Hole",
    image: "/venues/kimberley.jpg",
    address: "Big Hole, Kimberley",
    region: "Northern Cape",
  },
  // ...more venues
];
