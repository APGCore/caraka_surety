import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetGuarantorBranch {
  selectedGuarantorId?: number | string | null;
}

const useGetGuarantorBranch = ({ selectedGuarantorId }: IUseGetGuarantorBranch) => {
  const [branchGuarantor, setBranchGuarantor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (selectedGuarantorId) {
      axios
        .get(route("staff-guarantor-get.byHeadIsPairing", { guarantor: selectedGuarantorId }))
        .then((response) => {
          if (!ignore) {
            console.log("RESPONSE GET BRANCH GUARANTOR: ", response.data);
            setBranchGuarantor(response.data.data);
          }
        })
        .catch((error) => {
          setError(error);
          console.log("ERROR GET BRANCH GUARANTOR: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [selectedGuarantorId]);

  return { branchGuarantor, loading, error };
};

export default useGetGuarantorBranch;
