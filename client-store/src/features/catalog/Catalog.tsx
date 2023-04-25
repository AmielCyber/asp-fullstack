import { useEffect, } from "react";
// My imports.
import Loading from "../../layout/Loading";
import ProductList from "./ProductList";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const dispatch = useAppDispatch();
  const {productsLoaded, status} = useAppSelector(state => state.catalog);

  console.log(products)

  useEffect(() => {
    if(!productsLoaded){
      dispatch(fetchProductsAsync())
    }
  }, [productsLoaded,dispatch]);

  if (status.includes('pending')) {
    return <Loading message="Loading products..." />;
  }

  return <ProductList products={products} />;
}
