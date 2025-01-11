import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const useLoginForm = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    username: "",
    password: "",
    remember: false,
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
