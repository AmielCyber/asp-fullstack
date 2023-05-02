import { Navigate, createBrowserRouter } from "react-router-dom";
// My imports.
import Root from "../routes/Root";
import RequiredAuth from "./RequiredAuth";
import CheckoutWrapper from "../features/checkout/CheckoutWrapper";
import Orders from "../features/orders/Orders";
import Catalog from "../features/catalog/Catalog";
import ProductDetails from "../features/catalog/ProductDetails";
import AboutPage from "../routes/about/AboutPage";
import ContactPage from "../routes/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import CartPage from "../features/cart/CartPage";
import Login from "../features/account/Login";
import Register from "../features/account/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <RequiredAuth />,
        children: [
          { path: "checkout", element: <CheckoutWrapper /> },
          { path: "orders", element: <Orders /> },
        ],
      },
      { path: "catalog", element: <Catalog /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "cart", element: <CartPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);

export default router;
