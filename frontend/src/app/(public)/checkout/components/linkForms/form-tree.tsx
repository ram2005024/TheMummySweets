"use client";

import { useEphimeralCheckoutStore } from "@/store/checkout.store";
import { AnimatePresence, motion } from "framer-motion";
import StripePayment from "../checkout-order/stripe-payment-ui";
import StripeProvider from "../checkout-order/stripe-provider";
import OrderItems from "../order-items";
import Review from "../review";
import DeliveryForm from "./delivery";
import Payment from "./payment";
import Timing from "./timing";

const FormTree = () => {
  const clientSecret = useEphimeralCheckoutStore(
    (state) => state.client_secret,
  );
  const orderId = useEphimeralCheckoutStore((state) => state.order_id);
  const activeLink = useEphimeralCheckoutStore((state) => state.activeLink);
  const steps = {
    1: <DeliveryForm />,
    2: <Timing />,
    3: <Payment />,
    4: <Review />,
    5: clientSecret && orderId && (
      <StripeProvider client_secret={clientSecret}>
        <StripePayment orderId={orderId} />
      </StripeProvider>
    ),
  };

  return (
    <div className="flex pt-4 max-sm:flex-col sm:gap-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLink}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-1"
        >
          {steps[activeLink as keyof typeof steps]}
        </motion.div>
      </AnimatePresence>

      <OrderItems />
    </div>
  );
};

export default FormTree;
