import { CheckCheck, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OrderResponse } from "@/lib/api-orders";
import {
  formatOrderTime,
  formatPrice,
  getStatusBadgeClass,
} from "@/features/pos/utils";

type RecentOrdersPanelProps = {
  orders: OrderResponse[];
  loading: boolean;
  error: string;
  updatingOrderId: string | null;
  onRefresh: () => void;
  onMarkDone: (orderId: string) => void;
};

export function RecentOrdersPanel({
  orders,
  loading,
  error,
  updatingOrderId,
  onRefresh,
  onMarkDone,
}: RecentOrdersPanelProps) {
  return (
    <section className="min-w-0 overflow-hidden">
      <Card className="mt-0 md:mt-0 flex h-full min-h-0 flex-col overflow-hidden py-3">
        <CardHeader className="px-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Zadnje narudžbe</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Osvježi
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Učitavanje narudžbi...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Još nema kreiranih narudžbi.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={
                    order.status === "done"
                      ? "rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      : "rounded-xl border border-orange-200 bg-orange-50/60 p-3 shadow-sm dark:border-orange-900/50 dark:bg-orange-950/20"
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">
                        Narudžba #{order.orderNumber}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {formatOrderTime(order.createdAt)}
                      </div>
                    </div>
                    <Badge className={getStatusBadgeClass(order.status)}>
                      {order.status === "done" ? "Gotovo" : "U toku"}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div key={`${order._id}-${index}`}>
                        {item.quantity}x {item.productName}
                        {item.variantName ? ` · ${item.variantName}` : ""}
                      </div>
                    ))}
                    {order.items.length > 4 ? (
                      <div>+ još {order.items.length - 4} stavki</div>
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="font-semibold">
                      {formatPrice(order.totalAmount)}
                    </div>
                    {order.status === "in_progress" ? (
                      <Button
                        size="sm"
                        onClick={() => onMarkDone(order._id)}
                        disabled={updatingOrderId === order._id}
                      >
                        {updatingOrderId === order._id ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Slanje...
                          </>
                        ) : (
                          <>
                            <CheckCheck className="size-4" />
                            Označi kao gotovo
                          </>
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
