import { useEffect, useState } from "react";
import { useFetchApi } from "./useFetchApi";

export function useShopInfo() {
  const { handleFetchApi, isLoading } = useFetchApi();
  const [shopInfo, setShopInfo] = useState(null);

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const data = await handleFetchApi("shop");
        console.log("data", data);
        if (!isLoading) {
          setShopInfo(data);
        }

      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };
    fetchShopInfo();
  }, []);
  return { shopInfo, isLoading, };
}
