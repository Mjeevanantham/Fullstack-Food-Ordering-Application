'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { isAuthenticated, canManagePaymentMethods, getUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const paymentMethodSchema = z.object({
  type: z.enum(['CARD', 'PAYPAL', 'BANK_TRANSFER']),
  last4: z.string().optional(),
  brand: z.string().optional(),
});

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

interface PaymentMethod {
  id: string;
  type: string;
  last4: string | null;
  brand: string | null;
  createdAt: string;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = getUser();
  const [targetUserId, setTargetUserId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    if (!canManagePaymentMethods()) {
      router.push('/restaurants');
      return;
    }
    if (user) {
      setTargetUserId(user.id);
    }
  }, [router, user]);

  const { data: paymentMethods, isLoading } = useQuery<PaymentMethod[]>({
    queryKey: ['payment-methods', targetUserId],
    queryFn: () => api.get(`/users/${targetUserId}/payment-methods`),
    enabled: !!targetUserId && isAuthenticated() && canManagePaymentMethods(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: 'CARD',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PaymentMethodForm) => {
      return api.post(`/users/${targetUserId}/payment-methods`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods', targetUserId] });
      reset();
    },
  });

  const onSubmit = async (data: PaymentMethodForm) => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to create payment method', error);
    }
  };

  if (!isAuthenticated() || !canManagePaymentMethods()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Slooze Admin</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/restaurants')}>
              Restaurants
            </Button>
            <Button variant="outline" onClick={() => router.push('/orders')}>
              Orders
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Payment Methods Management</h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Payment Method</CardTitle>
              <CardDescription>Create a new payment method for user</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    placeholder="Enter user ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Payment Type</Label>
                  <select
                    id="type"
                    {...register('type')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="CARD">Card</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last4">Last 4 Digits (optional)</Label>
                  <Input id="last4" {...register('last4')} placeholder="1234" />
                  {errors.last4 && (
                    <p className="text-sm text-destructive">{errors.last4.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand (optional)</Label>
                  <Input id="brand" {...register('brand')} placeholder="Visa, Mastercard, etc." />
                  {errors.brand && (
                    <p className="text-sm text-destructive">{errors.brand.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Payment Method'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Payment methods for user: {targetUserId || 'Select user'}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              )}

              {paymentMethods && paymentMethods.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No payment methods found. Add one using the form.
                </p>
              )}

              {paymentMethods && paymentMethods.length > 0 && (
                <div className="space-y-2">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold capitalize">{pm.type}</p>
                          {pm.brand && <p className="text-sm text-muted-foreground">{pm.brand}</p>}
                          {pm.last4 && (
                            <p className="text-sm text-muted-foreground">**** {pm.last4}</p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(pm.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

