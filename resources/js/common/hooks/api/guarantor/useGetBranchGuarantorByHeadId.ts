import axios from "axios";
import { useEffect, useState } from "react";

interface IUseGetBranchGuarantorByHeadId {
  headquarterId?: number | string | null;
}

const useGetBranchGuarantorByHeadId = ({ headquarterId }: IUseGetBranchGuarantorByHeadId) => {
  const [branchGuarantors, setBranchGuarantors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (headquarterId) {
      axios
        .get(route("references.guarantor.branch-by-headquarter", { headquarterId }))
        .then((response) => {
          if (!ignore) {
            setBranchGuarantors(response.data.data);
          }
        })
        .catch((error) => {
          setError(error);
          console.log("ERROR GET BRANCH GUARANTOR BY HEAD ID: ", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    return () => {
      ignore = true;
    };
  }, [headquarterId]);

  return { branchGuarantors, loading, error };
};

export default useGetBranchGuarantorByHeadId;
