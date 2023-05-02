import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
// My imports.
import { useAppDispatch } from "../../store/configureStore";
import agent from "../../api/agent";
import { setCart } from "../cart/cartSlice";
import Loading from "../../layout/Loading";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe(
  "pk_test_51N2jEpAihu7K55batRM37mHIrqJ1QhI8P7ipvvn7XwJDyKU4MFeLy8lvtia1B1spiInAfFVV8lBW0kmzi3SYPuJQ008PtWIFv3"
);

export default function CheckoutWrapper() {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    agent.Payments.createPaymentIntent()
      .then((cart) => dispatch(setCart(cart)))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <Loading message="Loading checkout..." />;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}
