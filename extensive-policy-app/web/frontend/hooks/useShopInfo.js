import { useEffect, useState } from "react";
import { useFetchApi } from "./useFetchApi";
import { useDispatch, useSelector } from 'react-redux'
import { fetchShopInfo } from "../stores/redux-toolkit/slices/shop.slice";

export function useShopInfo() {
  const { handleFetchApi } = useFetchApi();
  const shop = useSelector(state => state.shop)
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!shop.shop && count <= 3) {
      dispatch(fetchShopInfo(handleFetchApi));
      setCount(prev => prev + 1);
      return
    }
    console.log("shop.shop", shop.shop);
    if (count > 3) {

      return
    }
  }, [shop, handleFetchApi, fetchShopInfo, dispatch, count]);
  return shop;
}
