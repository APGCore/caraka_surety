import "../css/app.css";
import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import ReactQueryProvider from "./components/common/react-query-provider";

const appName = import.meta.env.VITE_APP_NAME || "APG-CORE-System";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <ReactQueryProvider>
        <App {...props} />
      </ReactQueryProvider>,
    );
  },
  progress: {
    color: "#FF0000",
    delay: 0,
  },
});
