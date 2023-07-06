import Head from "next/head";
import { useForm } from "react-hook-form";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

interface LoginData {
  username: string;
  password: string;
}

interface FormErrorProps {
  message: string;
}

const FormError = ({ message }: FormErrorProps) => {
  return (
    <span className="px-2 text-sm font-semibold text-accent">{message}</span>
  );
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const emailValid = errors.username ? false : true;
  const passwordValid = errors.password ? false : true;
  const inputStyle = "px-2 py-1 w-full text-description/70 rounded-lg";
  const validInput = "border border-primary focus:outline-primary";
  const invalidInput = "border border-accent focus:outline-accent";

  const onSubmit = handleSubmit((data) => signIn("credentials", { ...data }));

  return (
    <div className="flex h-[500px] w-[325px] flex-col rounded-lg bg-white px-2 py-4 shadow-lg md:w-[350px] ">
      <h1 className="mb-12 text-center text-4xl font-bold text-primary">
        Login
      </h1>
      <form className="flex h-full flex-col gap-4 px-4" onSubmit={onSubmit}>
        <FormControl isInvalid={!emailValid} isRequired>
          <FormLabel className="text-description/70" mb={1}>
            Email
          </FormLabel>
          <input
            className={
              emailValid
                ? `${inputStyle} ${validInput}`
                : `${inputStyle} ${invalidInput}`
            }
            placeholder="example@example.com"
            type="email"
            {...register("username", { required: true })}
          />
          {!emailValid && <FormError message="Email is required" />}
        </FormControl>
        <FormControl isInvalid={!passwordValid} isRequired>
          <FormLabel className="text-description/70" mb={1}>
            password
          </FormLabel>
          <input
            className={
              passwordValid
                ? `${inputStyle} ${validInput}`
                : `${inputStyle} ${invalidInput}`
            }
            placeholder="password"
            type="password"
            {...register("password", { required: true })}
          />
          {!passwordValid && <FormError message="Password is required" />}
        </FormControl>
        <button
          className={`
              mt-8 w-4/5 cursor-pointer self-center rounded-lg 
              bg-primary py-1 text-lg font-bold text-white outline-primary 
              [transition:_transform_200ms_ease-in] hover:scale-105 focus:scale-105 
            `}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

const Login = () => {
  return (
    <>
      <Head>
        <title>Health Hub - Login</title>
      </Head>
      <main className="flex min-h-screen w-full items-center justify-center bg-gray-200">
        <LoginForm />
      </main>
    </>
  );
};

export default Login;
