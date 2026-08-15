import { OrderForm } from "@/components/orders/order-form";
import { createOrder } from "@/lib/actions/orders";

export default function NewOrderPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Nueva orden</h1>
      <OrderForm action={createOrder} submitLabel="Crear orden" />
    </div>
  );
}
