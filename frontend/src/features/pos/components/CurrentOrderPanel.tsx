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
        <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-5">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed text-center text-base text-muted-foreground">
                <UtensilsCrossed className="mb-4 size-8" />
                Narudžba je prazna.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border bg-background p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="text-lg font-semibold leading-tight">
                          {item.productName}
                        </div>

                        {item.variantName ? (
                          <div className="mt-2 text-base text-muted-foreground">
                            Varijanta:{" "}
                            <span className="font-medium text-foreground">
                              {item.variantName}
                            </span>
                          </div>
                        ) : null}

                        {item.removedIngredients.length > 0 ? (
                          <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-base text-red-700">
                            Bez: {item.removedIngredients.join(", ")}
                          </div>
                        ) : null}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 shrink-0 rounded-full text-destructive hover:text-destructive"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="size-6" />
                      </Button>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 rounded-full border bg-muted/30 px-3 py-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 rounded-full"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="size-5" />
                        </Button>

                        <span className="min-w-10 text-center text-xl font-bold">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-11 w-11 rounded-full"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="size-5" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatPrice(item.unitPrice)} po kom
                        </div>

                        <div className="text-xl font-bold">
                          {formatPrice(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 shrink-0 space-y-4 border-t pt-5">
            <Textarea
              value={orderNote}
              onChange={(event) => onOrderNoteChange(event.target.value)}
              placeholder="Napomena za cijelu narudžbu, npr. Sto 3"
              rows={3}
              className="min-h-24 resize-none rounded-xl text-base"
            />

            <div className="flex items-center justify-between rounded-2xl border bg-muted/30 px-5 py-4">
              <span className="text-base text-muted-foreground">Ukupno</span>

              <span className="text-2xl font-bold">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-xl text-lg font-semibold"
                onClick={onClearOrder}
                disabled={items.length === 0 || sendingOrder}
              >
                Očisti
              </Button>

              <Button
                size="lg"
                className="h-14 rounded-xl text-lg font-semibold"
                onClick={onSendOrder}
                disabled={items.length === 0 || sendingOrder}
              >
                {sendingOrder ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
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
