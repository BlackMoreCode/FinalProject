import React from "react";
import ReactDOM from "react-dom/client"; // 'react-dom'에서 'client'로 변경
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./context/Store";
import { PersistGate } from "redux-persist/integration/react";

// ReactDOM.createRoot 사용
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
