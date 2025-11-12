import { useEffect } from "react";
import { useFetchApi } from "../../hooks/useFetchApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopInfo } from "../../stores/redux-toolkit/slices/shop.slice";

export default function ShopLayout({ children }) {
  const { handleFetchApi } = useFetchApi();
  const dispatch = useDispatch();
  const { shop, loading } = useSelector((state) => state.shop);
  useEffect(() => {
    console.log("shop", shop);
    if (!shop) {
      console.log("Haven't Shop Information!");

      // tránh gọi lại nhiều lần
      dispatch(fetchShopInfo(handleFetchApi));
    }
  }, [shop]);
  if (loading) return <div>Loading...</div>;
  return <div>{children}</div>;
}
