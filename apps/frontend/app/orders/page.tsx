'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { isAuthenticated, getUser, canCancelOrder } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  menuItem: {
    id: string;
    name: string;
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
  };
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders'),
    enabled: isAuthenticated(),
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return api.post(`/orders/${orderId}/cancel`, {});
    },
    onSuccess: () => {
      // Refetch orders
      window.location.reload();
    },
  });

  if (!isAuthenticated()) {
    return null;
  }

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrderMutation.mutateAsync(orderId);
    } catch (error) {
      alert('Failed to cancel order');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Slooze</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/restaurants')}>
              Restaurants
            </Button>
            <Button variant="outline" onClick={() => router.push('/cart')}>
              Cart
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">My Orders</h2>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-1/2 bg-muted rounded" />
                  <div className="h-4 w-1/3 bg-muted rounded mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-full bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {orders && orders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button onClick={() => router.push('/restaurants')}>Browse Restaurants</Button>
            </CardContent>
          </Card>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{order.restaurant.name}</CardTitle>
                      <CardDescription>
                        Order #{order.id.slice(0, 8)} • {new Date(order.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(order.totalAmount).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.menuItem.name} × {item.quantity}
                        </span>
                        <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    {canCancelOrder() &&
                      (order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <Button
                          variant="destructive"
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelOrderMutation.isPending}
                        >
                          Cancel Order
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

