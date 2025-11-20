let isGoogleMapsLoaded = false;
let loadingPromise: Promise<typeof google.maps> | null = null;

export const loadGoogleMaps = async (): Promise<typeof google.maps> => {
  // If already loaded, return immediately
  if (isGoogleMapsLoaded && window.google?.maps?.places) {
    return window.google.maps;
  }

  // If currently loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise(async (resolve, reject) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

      if (!apiKey) {
        reject(new Error("Google Maps API key is not configured"));
        return;
      }

      // Check if script already exists
      if (window.google?.maps?.places) {
        isGoogleMapsLoaded = true;
        resolve(window.google.maps);
        return;
      }

      // Create script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding&v=weekly`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Wait for places library to be available
        const waitForPlaces = () => {
          if (window.google?.maps?.places) {
            isGoogleMapsLoaded = true;
            resolve(window.google.maps);
          } else {
            setTimeout(waitForPlaces, 100);
          }
        };
        waitForPlaces();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps script"));
      };

      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });

  return loadingPromise;
};

export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const formatPriceLevel = (level?: number): string => {
  if (level === undefined || level === 0) return "Free";
  return "$".repeat(level);
};
