import { redirect } from "next/navigation";
import OrderResult from "./components/order-result";

interface Props {
  searchParams: Promise<{
    order_id?: string;
    payment_intent?: string;
    redirect_status?: string;
  }>;
}

export default async function PaymentResult({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.order_id;

  if (!orderId) {
    return redirect("/checkout");
  }

  return <OrderResult order_id={orderId} />;
}
