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
import { Link } from "react-router-dom";
// My import.
import type Product from "../../models/Product";

type Props = {
  product: Product;
};
export default function ProductCard(props: Props) {
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
          ${(props.product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.product.brand} / {props.product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Add to Cart</Button>
        <Button component={Link} to={`/catalog/${props.product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
