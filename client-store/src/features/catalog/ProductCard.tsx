import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
// My imports.
import type Product from "../../models/product";
import agent from "../../api/agent";
import { useStoreContext } from "../../context/StoreContext";
import currencyFormat from "../../util/currencyFormat";

type Props = {
  product: Product;
};
export default function ProductCard(props: Props) {
  const [loading, setLoading] = useState(false);
  const { setCart } = useStoreContext();

  const handleAddItem = (productId: number) => {
    setLoading(true);
    agent.Cart.addItem(productId)
      .then((cart) => setCart(cart))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {props.product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={props.product.name}
        titleTypographyProps={{
          sx: { fontWeight: "bold", color: "primary.main" },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain",
          bgcolor: "primary.light",
        }}
        image={props.product.pictureUrl}
        title={props.product.name}
      />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5">
          {currencyFormat(props.product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.product.brand} / {props.product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={loading}
          onClick={() => handleAddItem(props.product.id)}
          size="small"
        >
          Add to cart
        </LoadingButton>
        <Button component={Link} to={`/catalog/${props.product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
