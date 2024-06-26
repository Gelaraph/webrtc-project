import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import { userReducer } from "./store/reducer.js";
import ConnectedApp from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ConnectedApp />,
  },
]);

export const store = createStore(userReducer);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
