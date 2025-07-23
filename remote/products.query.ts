import { queryOptions } from "@tanstack/react-query";
import { getProduct, getProducts } from "./products.api";

export const getProductsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: getProducts,
  staleTime: 60 * 1000, // 1분
});

export const getProductQuery = (id: string) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    staleTime: 60 * 1000, // 1분
  });
