import { Box, Button, Grid, Typography } from "@mui/material";
// My imports.
import type { Order } from "../../models/order";
import type { CartItem } from "../../models/cart";
import CartTable from "../cart/CartTable";
import CartSummary from "../cart/CartSummary";

type Props = {
  order: Order;
  setSelectedOrder: (id: number) => void;
};

export default function OrderDetailed(props: Props) {
  const subtotal =
    props.order.orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ) ?? 0;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Order# {props.order.id} - {props.order.orderStatus}
        </Typography>
        <Button
          onClick={() => props.setSelectedOrder(0)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Back to orders
        </Button>
      </Box>
      <CartTable items={props.order.orderItems as CartItem[]} isCart={false} />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <CartSummary subtotal={subtotal} />
        </Grid>
      </Grid>
    </>
  );
}
