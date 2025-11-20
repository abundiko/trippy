'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryStates, parseAsString, parseAsFloat, parseAsArrayOf } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { searchPlaces } from '@/app/actions/places';
import { GoogleMap } from '@/components/map/google-map';
import { PlaceCard } from '@/components/ui/place-card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { type PlaceResult, type PlaceCategory } from '@/types/places';
import { LuArrowLeft, LuLoader } from 'react-icons/lu';

export default function SearchPage() {
    const router = useRouter();
    const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);

    const [searchParams] = useQueryStates({
        location: parseAsString.withDefault(''),
        lat: parseAsFloat.withDefault(0),
        lng: parseAsFloat.withDefault(0),
        budget: parseAsFloat.withDefault(100),
        categories: parseAsArrayOf(parseAsString).withDefault([]),
    });

    const { data: places, isLoading, error } = useQuery({
        queryKey: ['places', searchParams],
        queryFn: () => searchPlaces({
            location: searchParams.location,
            lat: searchParams.lat,
            lng: searchParams.lng,
            budget: searchParams.budget,
            categories: searchParams.categories as PlaceCategory[],
        }),
        enabled: !!searchParams.location && searchParams.categories.length > 0,
    });

    useEffect(() => {
        if (!searchParams.location || searchParams.categories.length === 0) {
            router.push('/');
        }
    }, [searchParams, router]);

    const handlePlaceSelect = (place: PlaceResult) => {
        setSelectedPlace(place);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/')}
                        >
                            <LuArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">Trippy</h1>
                            <p className="text-sm text-muted-foreground">{searchParams.location}</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {isLoading && (
                    <div className="flex items-center justify-center h-[600px]">
                        <div className="text-center">
                            <LuLoader className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">Finding amazing places...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <p className="text-lg text-destructive">Error loading places. Please try again.</p>
                        <Button onClick={() => router.push('/')} className="mt-4">
                            Go Back
                        </Button>
                    </div>
                )}

                {!isLoading && !error && places && (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Left Column - Places List */}
                        <div className="space-y-4 lg:h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-4 custom-scrollbar">
                            <div className="mb-4">
                                <h2 className="text-2xl font-bold mb-2">
                                    {places.length} Places Found
                                </h2>
                                <p className="text-muted-foreground">
                                    Budget: ${searchParams.budget} • {searchParams.categories.length} categories
                                </p>
                            </div>

                            {places.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-lg text-muted-foreground">
                                        No places found matching your criteria. Try adjusting your filters.
                                    </p>
                                </div>
                            ) : (
                                places.map((place) => (
                                    <PlaceCard
                                        key={place.id}
                                        place={place}
                                        isSelected={selectedPlace?.id === place.id}
                                        onSelect={() => handlePlaceSelect(place)}
                                    />
                                ))
                            )}
                        </div>

                        {/* Right Column - Map */}
                        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-200px)]">
                            <GoogleMap
                                places={places || []}
                                selectedPlace={selectedPlace}
                                onPlaceSelect={handlePlaceSelect}
                                center={{ lat: searchParams.lat, lng: searchParams.lng }}
                            />
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
        </div>
    );
}
