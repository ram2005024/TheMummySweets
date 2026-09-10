interface props {
  searchParams: Promise<{
    order_id: string;
  }>;
}
const PaymnentResult = async ({ searchParams }: props) => {
  const params = await searchParams;
  return <div></div>;
};

export default PaymnentResult;
