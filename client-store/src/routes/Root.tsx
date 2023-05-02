import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Outlet, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// My imports.
import { useAppDispatch } from "../store/configureStore";
import { fetchCurrentUser } from "../features/account/accountSlice";
import { fetchCartAsync } from "../features/cart/cartSlice";
import Loading from "../layout/Loading";
import Header from "../layout/Header";
import HomePage from "./home/HomePage";

export default function Root() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchCartAsync());
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} onThemeChange={handleThemeChange} />
      {loading ? (
        <Loading message="Initializing app..." />
      ) : location.pathname === "/" ? (
        <HomePage />
      ) : (
        <Container sx={{mt: 4}}>
          <Outlet />
        </Container>
      )}
    </ThemeProvider>
  );
}
