"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteOrder } from "@/lib/actions/orders";

export function OrderRowActions({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        nativeButton={false}
        render={<Link href={`/orders/${orderId}`} onClick={(e) => e.stopPropagation()} />}
      >
        <Eye className="text-muted-foreground" />
        <span className="sr-only">Ver</span>
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        nativeButton={false}
        render={<Link href={`/orders/${orderId}/edit`} onClick={(e) => e.stopPropagation()} />}
      >
        <Pencil className="text-muted-foreground" />
        <span className="sr-only">Editar</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()} />}
        >
          <Trash2 className="text-destructive" />
          <span className="sr-only">Eliminar</span>
        </DialogTrigger>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>¿Eliminar esta orden?</DialogTitle>
            <DialogDescription>
              Se van a borrar también todos los pagos registrados. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => startTransition(() => deleteOrder(orderId))}
            >
              {isPending ? "Eliminando..." : "Sí, eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
