'use client';

import { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '@/lib/google-maps';
import { type PlaceResult } from '@/types/places';

type GoogleMapProps = {
    places: PlaceResult[];
    selectedPlace: PlaceResult | null;
    onPlaceSelect: (place: PlaceResult) => void;
    center: { lat: number; lng: number };
};

export function GoogleMap({ places, selectedPlace, onPlaceSelect, center }: GoogleMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current) return;

            await loadGoogleMaps();

            const map = new google.maps.Map(mapRef.current, {
                center,
                zoom: 13,
            });

            mapInstanceRef.current = map;
        };

        initMap();
    }, [center]);

    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // Add new markers
        places.forEach((place) => {
            const marker = new google.maps.Marker({
                position: { lat: place.lat, lng: place.lng },
                map: mapInstanceRef.current!,
                title: place.name,
                icon: {
                    url: selectedPlace?.id === place.id
                        ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                },
            });

            marker.addListener('click', () => {
                onPlaceSelect(place);
            });

            markersRef.current.push(marker);
        });
    }, [places, selectedPlace, onPlaceSelect]);

    useEffect(() => {
        if (selectedPlace && mapInstanceRef.current) {
            mapInstanceRef.current.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
            mapInstanceRef.current.setZoom(15);
        }
    }, [selectedPlace]);

    return (
        <div ref={mapRef} className="w-full h-full min-h-[600px] rounded-lg" />
    );
}
