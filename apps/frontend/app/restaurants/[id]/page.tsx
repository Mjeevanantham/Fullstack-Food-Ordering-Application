'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  country: {
    id: string;
    name: string;
    code: string;
  };
}

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const { data: restaurant, isLoading: restaurantLoading } = useQuery<Restaurant>({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => api.get(`/restaurants/${restaurantId}`),
    enabled: !!restaurantId && isAuthenticated(),
  });

  const { data: menuItems, isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ['menu', restaurantId],
    queryFn: () => api.get(`/restaurants/${restaurantId}/menu`),
    enabled: !!restaurantId && isAuthenticated(),
  });

  const handleAddToCart = (menuItem: MenuItem) => {
    const quantity = quantities[menuItem.id] || 1;
    addToCart({
      menuItemId: menuItem.id,
      restaurantId,
      name: menuItem.name,
      price: parseFloat(menuItem.price),
      quantity,
    });
    setQuantities((prev) => ({ ...prev, [menuItem.id]: 1 }));
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" onClick={() => router.push('/restaurants')}>
            ← Back to Restaurants
          </Button>
          <Button variant="outline" onClick={() => router.push('/cart')}>
            Cart
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {restaurantLoading && (
          <div className="animate-pulse">
            <div className="h-8 w-1/2 bg-muted rounded mb-4" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        )}

        {restaurant && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-muted-foreground mb-2">{restaurant.country.name}</p>
            {restaurant.description && (
              <p className="text-lg text-muted-foreground">{restaurant.description}</p>
            )}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Menu</h2>

        {menuLoading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {menuItems && (
          <div className="grid gap-4 md:grid-cols-2">
            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription className="mt-1">
                        ${parseFloat(item.price).toFixed(2)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.id] || 1}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {menuItems && menuItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No menu items available
          </div>
        )}
      </main>
    </div>
  );
}

