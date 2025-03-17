import axios from "axios";
import { useEffect, useState } from "react";

const useGetAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    axios
      .get(route("staff-products-get.all"))
      .then((response) => {
        if (!ignore) {
          setProducts(response.data.data);
        }
      })
      .catch((error) => {
        setError(error);
        console.log("ERROR GET ALL PRODUCTS: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { products, loading, error };
};

export default useGetAllProduct;
