import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// My imports.
import Header from "../layout/Header";
import { useStoreContext } from "../context/StoreContext";
import getCookie from "../util/cookie";
import agent from "../api/agent";
import Loading from "../layout/Loading";

export default function Root() {
  const { setCart } = useStoreContext();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Cart.get()
        .then((cart) => setCart(cart))
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setCart]);

  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return <Loading message="Initializing app..." />;
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} onThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}
