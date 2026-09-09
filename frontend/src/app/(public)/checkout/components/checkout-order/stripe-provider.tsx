import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";
interface Prop {
  client_secret: string;
  children: ReactNode;
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
const StripeProvider = ({ client_secret, children }: Prop) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: client_secret,
      }}
    >
      {children}
    </Elements>
  );
};

export default StripeProvider;
