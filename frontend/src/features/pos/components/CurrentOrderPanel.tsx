import { Loader2, Minus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { OrderItem } from "@/features/pos/types";
import { formatPrice } from "@/features/pos/utils";

type CurrentOrderPanelProps = {
  items: OrderItem[];
  orderNote: string;
  totalAmount: number;
  sendingOrder: boolean;
  onOrderNoteChange: (value: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, nextQuantity: number) => void;
  onClearOrder: () => void;
  onSendOrder: () => void;
};

export function CurrentOrderPanel({
  items,
  orderNote,
  totalAmount,
  sendingOrder,
  onOrderNoteChange,
  onRemoveItem,
  onUpdateQuantity,
  onClearOrder,
  onSendOrder,
}: CurrentOrderPanelProps) {
  return (
    <section className="min-w-0 overflow-hidden">
      <Card className="mt-0 md:mt-0 flex h-full min-h-0 flex-col overflow-hidden py-3">
        <CardHeader className="px-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Trenutna narudžba</CardTitle>
            </div>
            <Button variant="outline" size="sm" disabled>
              {items.length}
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                <UtensilsCrossed className="mb-3 size-5" />
                Narudžba je prazna.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border bg-background p-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{item.productName}</div>
                        {item.variantName ? (
                          <div className="mt-1 text-sm text-muted-foreground">
                            Varijanta: {item.variantName}
                          </div>
                        ) : null}
                        {item.note ? (
                          <div className="mt-1 text-sm text-muted-foreground">
                            Napomena: {item.note}
                          </div>
                        ) : null}
                        {item.removedIngredients.length > 0 ? (
                          <div className="mt-1 text-sm text-muted-foreground">
                            Bez: {item.removedIngredients.join(", ")}
                          </div>
                        ) : null}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="size-4" />
                        </Button>
                        <span className="min-w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatPrice(item.unitPrice)} po kom
                        </div>
                        <div className="font-semibold">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 shrink-0 space-y-3 border-t pt-4">
            <Textarea
              value={orderNote}
              onChange={(event) => onOrderNoteChange(event.target.value)}
              placeholder="Napomena za cijelu narudžbu, npr. Sto 3"
              rows={3}
            />
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-3">
              <span className="text-sm text-muted-foreground">Ukupno</span>
              <span className="text-lg font-semibold">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={onClearOrder}
                disabled={items.length === 0 || sendingOrder}
              >
                Očisti
              </Button>
              <Button
                onClick={onSendOrder}
                disabled={items.length === 0 || sendingOrder}
              >
                {sendingOrder ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Slanje...
                  </>
                ) : (
                  "Pošalji"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
