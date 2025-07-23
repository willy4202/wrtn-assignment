export const getProducts = async () => {
  const response = await fetch("http://localhost:3002/api/products", {
    next: {
      revalidate: 60,
    },
  });
  const data = await response.json();

  return data;
};
