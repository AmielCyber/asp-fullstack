import type { StripeElementType } from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useFormContext } from "react-hook-form";
import { Grid, TextField, Typography } from "@mui/material";
// My imports
import AppTextInput from "../../components/AppTextInput";
import StripeInput from "./StripeInput";

type Props = {
  cardState: { elementError: { [key in StripeElementType]?: string } };
  onCardInputChange: (event: any) => void;
};

export default function PaymentForm(props: Props) {
  const { control } = useFormContext();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AppTextInput
            name="nameOnCard"
            label="Name on card"
            control={control}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            onChange={props.onCardInputChange}
            error={!!props.cardState.elementError.cardNumber}
            helperText={props.cardState.elementError.cardNumber}
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardNumberElement,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            onChange={props.onCardInputChange}
            error={!!props.cardState.elementError.cardExpiry}
            helperText={props.cardState.elementError.cardExpiry}
            id="expDate"
            label="Expiry date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardExpiryElement,
              },
            }}
            autoComplete="cc-exp"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            onChange={props.onCardInputChange}
            error={!!props.cardState.elementError.cardCvc}
            helperText={props.cardState.elementError.cardCvc}
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardCvcElement,
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}
