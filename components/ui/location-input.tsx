'use client';

import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LuMapPin, LuLoader } from 'react-icons/lu';
import { loadGoogleMaps, getCurrentLocation } from '@/lib/google-maps';

type LocationInputProps = {
  value: string;
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
};

export function LocationInput({ value, onLocationSelect, placeholder = 'Enter location' }: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    const initializeServices = async () => {
      await loadGoogleMaps();

      autocompleteService.current = new google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(mapDiv);
    };

    initializeServices();
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!newValue.trim() || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      { input: newValue },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handleSuggestionClick = (placeId: string) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const location = {
            address: place.formatted_address || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          setInputValue(location.address);
          onLocationSelect(location);
          setSuggestions([]);
        }
      }
    );
  };

  const handleCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await getCurrentLocation();
      await loadGoogleMaps();

      const geocoder = new google.maps.Geocoder();

      const result = await geocoder.geocode({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      });

      if (result.results[0]) {
        const location = {
          address: result.results[0].formatted_address,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setInputValue(location.address);
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                  onClick={() => handleSuggestionClick(suggestion.place_id)}
                >
                  {suggestion.description}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleCurrentLocation}
          disabled={isLoadingLocation}
        >
          {isLoadingLocation ? (
            <LuLoader className="h-4 w-4 animate-spin" />
          ) : (
            <LuMapPin className="h-4 w-4" />
          )}
          <span className="sr-only">Use current location</span>
        </Button>
      </div>
    </div>
  );
}
