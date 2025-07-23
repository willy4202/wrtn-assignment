import { queryOptions } from "@tanstack/react-query";
import { getProducts } from "./products.api";

export const getProductsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: getProducts,
});
