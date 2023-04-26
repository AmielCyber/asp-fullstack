import { Grid } from "@mui/material";
// My imports.
import type Product from "../../models/product";
import { useAppSelector } from "../../store/configureStore";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};
export default function ProductList(props: Props) {
  const { productsLoaded } = useAppSelector((state) => state.catalog);
  return (
    <Grid container spacing={4}>
      {props.products.map((product) => (
        <Grid item xs={3} key={product.id}>
          {!productsLoaded ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard product={product} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
