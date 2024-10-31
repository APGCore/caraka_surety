import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetProductTypesByProductAndGuarantor {
  selectedProductId?: number | string | null;
  selectedGuarantorId?: number | string | null;
}

const useGetProductTypesByProductAndGuarantor = ({
  selectedProductId,
  selectedGuarantorId,
}: IUseGetProductTypesByProductAndGuarantor) => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (selectedProductId && selectedGuarantorId) {
      axios
        .get(
          route("staff-product-types-get.by-product-and-guarantor", {
            productId: selectedProductId,
            guarantorId: selectedGuarantorId,
          }),
        )
        .then((response) => {
          if (!ignore) {
            setProductTypes(response.data.data);
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
  }, [selectedProductId, selectedGuarantorId]);

  return { productTypes, loading, error };
};

export default useGetProductTypesByProductAndGuarantor;
