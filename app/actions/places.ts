"use server";

import { type PlaceCategory, type PlaceResult } from "@/types/places";

export async function searchPlaces(params: {
  location: string;
  lat: number;
  lng: number;
  budget: number;
  categories: PlaceCategory[];
}): Promise<PlaceResult[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Google Maps API key not configured");
  }

  const { lat, lng, categories, budget } = params;
  const results: PlaceResult[] = [];

  // Map our categories to Google Places API types
  const typeMap: Record<PlaceCategory, string> = {
    hotel: "lodging",
    restaurant: "restaurant",
    cafe: "cafe",
    bar: "bar",
    park: "park",
    museum: "museum",
    shopping_mall: "shopping_mall",
    entertainment: "movie_theater",
    tourist_attraction: "tourist_attraction",
    gym: "gym",
  };

  // Fetch places for each category
  for (const category of categories) {
    const type = typeMap[category];
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results) {
        const places: PlaceResult[] = data.results
          .slice(0, 5)
          .map((place: any) => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity || place.formatted_address || "",
            rating: place.rating,
            priceLevel: place.price_level,
            priceRange: getPriceRange(place.price_level),
            photos: place.photos
              ? [
                  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`,
                ]
              : [],
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            types: place.types || [],
            openNow: place.opening_hours?.open_now,
            vicinity: place.vicinity,
          }));

        // Filter by budget if price_level is available
        const filteredPlaces = places.filter((place) => {
          if (place.priceLevel === undefined) return true;
          // Budget ranges: $0-50: level 0-1, $50-150: level 2, $150+: level 3-4
          if (budget <= 50) return place.priceLevel <= 1;
          if (budget <= 150) return place.priceLevel <= 2;
          return true;
        });

        results.push(...filteredPlaces);
      }
    } catch (error) {
      console.error(`Error fetching places for ${category}:`, error);
    }
  }

  return results;
}

function getPriceRange(priceLevel?: number): string {
  switch (priceLevel) {
    case 0:
      return "Free";
    case 1:
      return "$";
    case 2:
      return "$$";
    case 3:
      return "$$$";
    case 4:
      return "$$$$";
    default:
      return "N/A";
  }
}
