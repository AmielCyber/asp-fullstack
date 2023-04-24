import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Add, Delete, Remove } from "@mui/icons-material";
import { Link } from "react-router-dom";
// My imports.
import { useStoreContext } from "../../context/StoreContext";
import agent from "../../api/agent";
import CartSummary from "./CartSummary";

const initialStatus = {
  loading: false,
  name: "",
};

export default function CartPage() {
  const { cart, setCart, removeItem } = useStoreContext();
  const [status, setStatus] = useState(initialStatus);

  const handleAddItem = (productId: number, name: string) => {
    setStatus({ loading: true, name });
    agent.Cart.addItem(productId)
      .then((cart) => setCart(cart))
      .catch((e) => console.log(e))
      .finally(() => setStatus(initialStatus));
  };

  const handleRemoveItem = (productId: number, quantity = 1, name: string) => {
    setStatus({ loading: true, name });
    agent.Cart.removeItem(productId, quantity)
      .then((cart) => setCart(cart))
      .then(() => removeItem(productId, quantity))
      .catch((e) => console.log(e))
      .finally(() => setStatus(initialStatus));
  };

  if (!cart) {
    return <Typography variant="h3">Your cart is empty</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      style={{ height: 50, marginRight: 20 }}
                      src={item.pictureUrl}
                      alt={item.name}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${(item.price / 100).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    loading={
                      status.loading && status.name === "rem" + item.productId
                    }
                    onClick={() =>
                      handleRemoveItem(
                        item.productId,
                        1,
                        "rem" + item.productId
                      )
                    }
                    color="error"
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    loading={
                      status.loading && status.name === "add" + item.productId
                    }
                    onClick={() =>
                      handleAddItem(item.productId, "add" + item.productId)
                    }
                    color="secondary"
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  ${((item.price / 100) * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton
                    loading={
                      status.loading && status.name === "del" + item.productId
                    }
                    onClick={() =>
                      handleRemoveItem(
                        item.productId,
                        item.quantity,
                        "del" + item.productId
                      )
                    }
                    color="error"
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <CartSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
