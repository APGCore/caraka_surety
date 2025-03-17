import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const useLoginForm = () => {
  const { data, setData, post, processing, errors, reset } = useForm<{
    username: string;
    password: string;
    remember: boolean;
    // guarantor_id: number;
  }>({
    username: "",
    password: "",
    remember: false,
    // guarantor_id: 0,
  });

  const handleLogin: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onSuccess: () => {
        reset("username");
        reset("password");
      },
    });
  };

  return {
    data,
    setData,
    processing,
    errors,
    handleLogin,
  };
};

export default useLoginForm;
