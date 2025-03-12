import React from "react";
import ReactDOM from "react-dom/client"; // 'react-dom'에서 'client'로 변경
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store, { persistor } from "./context/Store";
import { PersistGate } from "redux-persist/integration/react";
import { enableMapSet } from "immer"; // 추가

// Immer에서 Map과 Set을 사용할 수 있도록 활성화
enableMapSet(); // 추가

// ReactDOM.createRoot 사용
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
