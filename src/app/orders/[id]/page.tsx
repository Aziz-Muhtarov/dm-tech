// src/app/orders/[id]/page.tsx
import OrderDetails from "@/components/OrderDetails/OrderDetails";

interface Props {
  params: { id: string };
}

export default function OrderDetailsPage({ params }: Props) {
  console.log("params.id:", params.id); // должно выводить значение из URL
  return <OrderDetails params={params} />;
}