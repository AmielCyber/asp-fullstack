import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
// My imports.
import type Product from "../../models/product";
import agent from "../../api/agent";
import Loading from "../../layout/Loading";
import NotFound from "../../errors/NotFound";
import { useStoreContext } from "../../context/StoreContext";

export default function ProductDetails() {
  const { cart, setCart, removeItem } = useStoreContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(0);

  const item = cart?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }
    id &&
      agent.Catalog.details(parseInt(id))
        .then((response) => setProduct(response))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
  }, [id, item]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const targetNum = parseInt(event.target.value);
    if (targetNum >= 0) {
      setQuantity(targetNum);
    }
  };

  const handleUpdateCart = () => {
    if (!product) {
      return;
    }
    setSubmitting(true);
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      agent.Cart.addItem(product.id, updatedQuantity)
        .then((cart) => setCart(cart))
        .catch((e) => console.log(e))
        .finally(() => setSubmitting(false));
    } else {
      const updatedQuantity = item.quantity - quantity;
      agent.Cart.removeItem(product.id, updatedQuantity)
        .then(() => removeItem(product.id, updatedQuantity))
        .catch((e) => console.log(e))
        .finally(() => setSubmitting(false));
    }
  };

  if (loading) {
    return <Loading message="Loading product..." />;
  }
  if (!product) {
    return <NotFound />;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody sx={{ fontSize: "1.1em" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              label="Quantity in cart"
              fullWidth
              value={quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                item?.quantity === quantity || (!item && quantity === 0)
              }
              loading={submitting}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update quantity" : "Add to cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
