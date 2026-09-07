"use client";
import { useCheckoutStore } from "@/store/checkout.store";
import OrderItems from "../order-items";
import Review from "../review";
import DeliveryForm from "./delivery";
import Payment from "./payment";
import Timing from "./timing";

const FormTree = () => {
  const activeLink = useCheckoutStore((state) => state.activeLink);

  return (
    <div className="pt-4 flex max-sm:flex-col sm:gap-20">
      {activeLink === 1 && <DeliveryForm />}
      {activeLink === 2 && <Timing />}
      {activeLink === 3 && <Payment />}
      {activeLink === 4 && <Review />}
      <OrderItems />
    </div>
  );
};

export default FormTree;
