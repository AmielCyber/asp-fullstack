import { Grid } from "@mui/material";
// My imports.
import type Product from "../../models/Product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};
export default function ProductList(props: Props) {
  return (
    <Grid container spacing={4}>
      {props.products.map((product) => (
        <Grid item xs={4} key={product.name}>
          <ProductCard key={product.id} product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
