'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { isAuthenticated, canCheckout, getUser } from '@/lib/auth';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const checkoutSchema = z.object({
  paymentMethod: z.enum(['CARD', 'PAYPAL', 'BANK_TRANSFER']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const { items, total, clearCart } = useCart();
  const user = getUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    if (!canCheckout()) {
      router.push('/restaurants');
      return;
    }
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [router, items]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'CARD',
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID required');
      return api.post('/orders', {
        restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return api.post(`/orders/${orderId}/checkout`, {});
    },
  });

  const onSubmit = async (data: CheckoutForm) => {
    setError(null);
    try {
      const order = await createOrderMutation.mutateAsync();
      await checkoutMutation.mutateAsync(order.id);
      clearCart();
      router.push(`/orders/${order.id}?success=true`);
    } catch (err: any) {
      setError(err.data?.message || 'Checkout failed. Please try again.');
    }
  };

  if (!isAuthenticated() || !canCheckout() || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" onClick={() => router.push('/cart')}>
            ← Back to Cart
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <select
                      {...register('paymentMethod')}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="CARD">Credit/Debit Card</option>
                      <option value="PAYPAL">PayPal</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createOrderMutation.isPending || checkoutMutation.isPending}
                  >
                    {createOrderMutation.isPending || checkoutMutation.isPending
                      ? 'Processing...'
                      : 'Complete Order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

