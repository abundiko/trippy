'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationInput } from '@/components/ui/location-input';
import { CategorySelect } from '@/components/ui/category-select';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type PlaceCategory } from '@/types/places';
import { LuMapPin, LuDollarSign, LuSearch, LuMap, LuHeart, LuClock } from 'react-icons/lu';

export default function HomePage() {
  const router = useRouter();
  const [location, setLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [budget, setBudget] = useState<number>(100);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || categories.length === 0) {
      alert('Please select a location and at least one category');
      return;
    }

    // Build search params using nuqs
    const params = new URLSearchParams({
      location: location.address,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      budget: budget.toString(),
      categories: categories.join(','),
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Trippy</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Discover Your Next Adventure
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect places to visit based on your location, budget, and interests
            </p>
          </div>

          {/* Search Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Plan Your Trip</CardTitle>
              <CardDescription>
                Enter your preferences to get personalized place suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Input */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <LuMapPin className="h-4 w-4" />
                    Location
                  </Label>
                  <LocationInput
                    value={location?.address || ''}
                    onLocationSelect={setLocation}
                    placeholder="Enter your destination"
                  />
                </div>

                {/* Budget Input */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="flex items-center gap-2">
                    <LuDollarSign className="h-4 w-4" />
                    Budget (USD)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    step="10"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    placeholder="100"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LuHeart className="h-4 w-4" />
                    Select Categories
                  </Label>
                  <CategorySelect
                    selectedCategories={categories}
                    onCategoriesChange={setCategories}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                  <LuSearch className="h-5 w-5 mr-2" />
                  Find Places
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 pb-24">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Trippy?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <LuMap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Suggestions</CardTitle>
                <CardDescription>
                  Get AI-powered recommendations based on your exact location and preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <LuDollarSign className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Budget-Friendly</CardTitle>
                <CardDescription>
                  Filter results by your budget to find places that match your spending range
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <LuClock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-Time Data</CardTitle>
                <CardDescription>
                  Access up-to-date information including ratings, prices, and opening hours
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
