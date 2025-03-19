import "../css/app.css";
import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { NuqsAdapter } from "nuqs/adapters/react";
import { createRoot } from "react-dom/client";
import ReactQueryProvider from "./components/organisms/provider/react-query-provider";

const appName = import.meta.env.VITE_APP_NAME === "Laravel" ? "APG-Core-System" : import.meta.env.VITE_APP_NAME;

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob("./pages/**/*.tsx")),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <ReactQueryProvider>
        <NuqsAdapter>
          <App {...props} />
        </NuqsAdapter>
      </ReactQueryProvider>,
    );
  },
  progress: {
    color: "#efbf04",
    delay: 0,
  },
});
