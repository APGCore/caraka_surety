import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetGuarantorByProductId {
  selectedProductId?: number | string | null;
}

const useGetGuarantorByProductId = ({ selectedProductId }: IUseGetGuarantorByProductId) => {
  const [guarantors, setGuarantors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (selectedProductId) {
      axios
        .get(route("staff-guarantor-get.byProduct", { product: selectedProductId }))
        .then((response) => {
          if (!ignore) {
            console.log("RESPONSE GET GUARANTOR BY PRODUCT ID: ", response.data);
            setGuarantors(response.data.data);
          }
        })
        .catch((error) => {
          setError(error);
          console.log("ERROR GET GUARANTOR BY PRODUCT ID: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [selectedProductId]);

  return { guarantors, loading, error };
};

export default useGetGuarantorByProductId;
