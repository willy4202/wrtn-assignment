export const getProducts = async () => {
  const response = await fetch("http://localhost:3002/api/products", {
    next: {
      tags: ["products"],
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export const getProduct = async (id: string) => {
  const response = await fetch(`http://localhost:3002/api/products/${id}`, {
    next: {
      revalidate: 60,
      tags: ["products", `product-${id}`],
    },
  });

  if (!response.ok) {
    // 404 에러를 명확하게 구분
    if (response.status === 404) {
      throw new Error(`404`);
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return data;
};
