import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MainContext from "./context/MainContext.jsx";
import "./index.css";

import "bootswatch/dist/darkly/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainContext>
      <App />
    </MainContext>
  </React.StrictMode>
);
