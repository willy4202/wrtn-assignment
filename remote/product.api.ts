export const getProducts = async () => {
  const response = await fetch("http://localhost:3000/api/products");
  const data = await response.json();
  return data;
};
