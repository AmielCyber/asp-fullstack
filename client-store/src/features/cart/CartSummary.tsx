import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
// My imports.
import { useAppSelector } from "../../store/configureStore";
import currencyFormat from "../../util/currencyFormat";

type Props = {
  subtotal?: number;
};

export default function CartSummary(props: Props) {
  const { cart } = useAppSelector((state) => state.cart);

  let subtotal = 0;
  if (props.subtotal === undefined) {
    subtotal =
      cart?.items.reduce((sum, item) => sum + item.quantity * item.price, 0) ??
      0;
  }
  const deliveryFee = subtotal > 10000 || subtotal === 0 ? 0 : 1500;

  return (
    <>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">
                {currencyFormat(subtotal + deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
