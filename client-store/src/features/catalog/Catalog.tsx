import { useEffect, useState } from "react";
// My imports.
import type Product from "../../models/product";
import agent from "../../api/agent";
import Loading from "../../layout/Loading";
import ProductList from "./ProductList";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.list()
      .then((products) => setProducts(products))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  return <ProductList products={products} />;
}
