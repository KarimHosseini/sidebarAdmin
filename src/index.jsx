import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

import ReactDOM from "react-dom/client";
import "react-image-crop/dist/ReactCrop.css";
import "react-image-lightbox/style.css";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import App from "./App";
import "./index.css";
import store from "./redux/store";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <CacheProvider value={cacheRtl}>
      <App />
    </CacheProvider>
  </Provider>
);
