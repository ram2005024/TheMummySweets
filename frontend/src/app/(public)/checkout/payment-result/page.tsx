import { redirect } from "next/navigation";
import OrderResult from "./components/order-result";

interface Props {
  searchParams: {
    order_id?: string;
  };
}

export default async function PaymentResult({ searchParams }: Props) {
  const orderId = searchParams.order_id;

  if (!orderId) {
    redirect("/checkout");
  }

  return <OrderResult order_id={orderId} />;
}
