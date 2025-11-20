'use client';

import { type PlaceResult } from '@/types/places';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LuMapPin, LuStar, LuClock, LuChevronDown } from 'react-icons/lu';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type PlaceCardProps = {
    place: PlaceResult;
    isSelected: boolean;
    onSelect: () => void;
};

export function PlaceCard({ place, isSelected, onSelect }: PlaceCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = () => {
        setIsExpanded(!isExpanded);
        onSelect();
    };

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "border-primary ring-2 ring-primary/20"
            )}
            onClick={handleClick}
        >
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-1">{place.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                            <LuMapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">{place.vicinity || place.address}</span>
                        </CardDescription>
                    </div>
                    <LuChevronDown
                        className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                            isExpanded && "rotate-180"
                        )}
                    />
                </div>

                <div className="flex items-center gap-4 mt-2 text-sm">
                    {place.rating && (
                        <div className="flex items-center gap-1">
                            <LuStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{place.rating.toFixed(1)}</span>
                        </div>
                    )}
                    {place.priceRange && (
                        <div className="font-medium text-primary">
                            {place.priceRange}
                        </div>
                    )}
                    {place.openNow !== undefined && (
                        <div className="flex items-center gap-1">
                            <LuClock className="h-4 w-4" />
                            <span className={place.openNow ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                                {place.openNow ? 'Open' : 'Closed'}
                            </span>
                        </div>
                    )}
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4 animate-in slide-in-from-top-2">
                    {place.photos && place.photos.length > 0 && (
                        <div className="relative h-48 rounded-lg overflow-hidden">
                            <img
                                src={place.photos[0]}
                                alt={place.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="space-y-2 text-sm">
                        <div>
                            <span className="font-medium">Address: </span>
                            <span className="text-muted-foreground">{place.address}</span>
                        </div>

                        {place.types && place.types.length > 0 && (
                            <div>
                                <span className="font-medium">Categories: </span>
                                <span className="text-muted-foreground">
                                    {place.types.slice(0, 3).map(type =>
                                        type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                                    ).join(', ')}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
