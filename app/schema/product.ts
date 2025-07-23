import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
});
