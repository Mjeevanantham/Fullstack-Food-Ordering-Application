'use client';

import { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  menuItem: {
    id: string;
    name: string;
    description: string | null;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  restaurant: {
    id: string;
    name: string;
    country: {
      name: string;
    };
  };
  orderItems: OrderItem[];
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id as string;
  const success = searchParams.get('success');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`),
    enabled: !!orderId && isAuthenticated(),
  });

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" onClick={() => router.push('/orders')}>
            ← Back to Orders
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {success && (
          <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="p-6">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                Order placed successfully!
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading && (
          <div className="animate-pulse">
            <div className="h-8 w-1/2 bg-muted rounded mb-4" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        )}

        {order && (
          <>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">Order Details</h1>
              <p className="text-muted-foreground">
                Order #{order.id.slice(0, 8)} • {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{order.restaurant.name}</CardTitle>
                <CardDescription>{order.restaurant.country.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.menuItem.name}</p>
                        {item.menuItem.description && (
                          <p className="text-sm text-muted-foreground">
                            {item.menuItem.description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold">${parseFloat(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold capitalize">{order.status}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => router.push('/restaurants')}>Browse More Restaurants</Button>
              <Button variant="outline" onClick={() => router.push('/orders')}>
                View All Orders
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

