import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
} from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
// My imports.
import Header from "../layout/Header";

export default function Root() {
  const [darkMode, setDarkMode] = useState(false);

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
      <CssBaseline />
      <Header darkMode={darkMode} onThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}
