import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
// My imports.
import router from "./router/Routes.tsx";
import { Provider } from "react-redux";
import { store } from "./store/configureStore.ts";
import "./layout/styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
  </StrictMode>
);
