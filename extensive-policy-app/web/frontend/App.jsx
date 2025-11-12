import { BrowserRouter, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { PolarisProvider } from "./components/providers/PolarisProvider";
import { QueryProvider } from "./components/providers/QueryProvider";
import { store } from "./stores/redux-toolkit/store";
import { Provider } from "react-redux";
import ShopLayout from "./components/layout/ShopLayout";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <Provider store={store}>
        <ShopLayout>
          <BrowserRouter>
            <QueryProvider>
              <NavMenu>
                <Link to="/" rel="home" />
                <Link to="/products">{t("NavigationMenu.products")}</Link>
                <Link to="/rules">{t("NavigationMenu.rules")}</Link>
              </NavMenu>
              <Routes pages={pages} />
            </QueryProvider>
          </BrowserRouter>
        </ShopLayout>
      </Provider>
    </PolarisProvider>
  );
}
