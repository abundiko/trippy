export type PlaceCategory =
  | "hotel"
  | "restaurant"
  | "cafe"
  | "bar"
  | "park"
  | "museum"
  | "shopping_mall"
  | "entertainment"
  | "tourist_attraction"
  | "gym";

export type PriceLevel = 0 | 1 | 2 | 3 | 4;

export type SearchParams = {
  location: string;
  lat: number;
  lng: number;
  budget: number;
  categories: PlaceCategory[];
};

export type PlaceResult = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  priceLevel?: PriceLevel;
  priceRange?: string;
  photos?: string[];
  lat: number;
  lng: number;
  types: string[];
  openNow?: boolean;
  vicinity?: string;
};

export type Location = {
  lat: number;
  lng: number;
};
