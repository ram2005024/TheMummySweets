import { useCheckoutStore } from "@/store/checkout.store";
import Review from "../review";
import DeliveryForm from "./delivery";
import Payment from "./payment";
import Timing from "./timing";

const FormTree = () => {
  const activeLink = useCheckoutStore((state) => state.activeLink);

  return (
    <>
      {activeLink === 1 && <DeliveryForm />}
      {activeLink === 2 && <Timing />}
      {activeLink === 3 && <Payment />}
      {activeLink === 4 && <Review />}
    </>
  );
};

export default FormTree;
