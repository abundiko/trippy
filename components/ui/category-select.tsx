'use client';

import { type PlaceCategory } from '@/types/places';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

type CategorySelectProps = {
    selectedCategories: PlaceCategory[];
    onCategoriesChange: (categories: PlaceCategory[]) => void;
};

const CATEGORIES: { value: PlaceCategory; label: string }[] = [
    { value: 'hotel', label: 'Hotels & Accommodations' },
    { value: 'restaurant', label: 'Restaurants & Eateries' },
    { value: 'cafe', label: 'Cafes & Coffee Shops' },
    { value: 'bar', label: 'Bars & Nightlife' },
    { value: 'park', label: 'Parks & Recreation' },
    { value: 'museum', label: 'Museums & Culture' },
    { value: 'shopping_mall', label: 'Shopping & Malls' },
    { value: 'entertainment', label: 'Entertainment & Events' },
    { value: 'tourist_attraction', label: 'Landmarks & Attractions' },
    { value: 'gym', label: 'Gyms & Fitness' },
];

export function CategorySelect({ selectedCategories, onCategoriesChange }: CategorySelectProps) {
    const handleToggle = (category: PlaceCategory) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        onCategoriesChange(newCategories);
    };

    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-3 text-sm">Places of Interest</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORIES.map((category) => (
                    <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                            id={category.value}
                            checked={selectedCategories.includes(category.value)}
                            onCheckedChange={() => handleToggle(category.value)}
                        />
                        <Label
                            htmlFor={category.value}
                            className="text-sm font-normal cursor-pointer"
                        >
                            {category.label}
                        </Label>
                    </div>
                ))}
            </div>
        </Card>
    );
}
