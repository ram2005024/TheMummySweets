import FormTree from "./components/linkForms/form-tree";
import TabLinks from "./components/tab-links";

const Checkout = () => {
  return (
    <div className="min-h-screen sm:max-w-[80%] max-sm:p-3 mx-auto w-full sm:py-10 py-2 overflow-hidden">
      <h1 className="text-3xl font-serif font-extrabold">Checkout</h1>
      <TabLinks />
      <FormTree />
    </div>
  );
};

export default Checkout;
