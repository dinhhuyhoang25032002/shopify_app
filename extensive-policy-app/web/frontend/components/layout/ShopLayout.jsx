import { useEffect } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopInfo } from "../../stores/redux-toolkit/slices/shop.slice";
import SkeletonExample from "./SkeletonPage";

export default function ShopLayout({ children }) {
  const { handleFetchApi } = useFetchApi();
  const dispatch = useDispatch();
  const { shop, loading } = useSelector((state) => state.shop);
  useEffect(() => {
    if (!shop) {
      dispatch(fetchShopInfo(handleFetchApi));
    }
  }, [shop]);
  if (loading) return <SkeletonExample />;
  return <div>{children}</div>;
}
