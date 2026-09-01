import axios from "axios";
import { ProductPayload } from "../types/product.types";

export async function createProduct(payload: ProductPayload) {
  const res = await axios.post("/api/products", payload);
  return res.data;
}
