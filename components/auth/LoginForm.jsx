"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect } from "react";
import { getData } from "@/lib/getData";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const { data: session, status } = useSession();
  const sessionUser = session?.user;

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    if (token && id) {
      setIsVerifying(true);
      const verifyData = {
        token,
        id,
      };
      async function verify() {
        const data = await getData(`users/${id}`);
        if (data) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
            const response = await fetch(`${baseUrl}/api/users/verify`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(verifyData),
            });
            if (response.ok) {
              setIsVerifying(false);
              toast.success("Account Verified Successfully");
            } else {
              setIsVerifying(false);
              toast.error("Something Went wrong");
            }
          } catch (error) {
            setIsVerifying(false);
            console.log(error);
          }
        }
      }
      verify();
      // const
    }
    console.log(token);
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    console.log(data);
    try {
      setLoading(true);
      console.log("Attempting to sign in with credentials:", data);
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      console.log("SignIn response:", loginData);
      if (loginData?.error) {
        setLoading(false);
        toast.error("Error: Check your credentials");
      } else {
        // Sign-in was successful
        toast.success("Login Successful");
        reset();
        router.push("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong with your Network");
    }
  }

  if (status === "authenticated" || sessionUser) {
    return router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isVerifying && <p>verifying please wait...</p>}
      <div>
        {/* <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium dark:text-gray-900 text-gray-50"
        >
          Your email
        </label> */}
        <input
          {...register("identifier", { required: true })}
          type="text"
          name="identifier"
          id="identifier"
          className="bg-transparent/50 outline-none focus:outline-white focus:outline-1  text-white placeholder:font-normal placeholder:text-gray-400  font-bold sm:text-sm rounded-lg  block w-full p-2.5"
          placeholder="Phone Number or Email"
          required=""
        />
        {errors.identifier && (
          <small className="text-red-500 font-bold text-sm ">
            This field is required
          </small>
        )}
      </div>
      <div>
        {/* <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium dark:text-gray-900 text-gray-50"
        >
          Password
        </label> */}
        <input
          {...register("password", { required: true })}
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          className="bg-transparent/50 outline-none focus:outline-white focus:outline-1  text-white placeholder:font-normal placeholder:text-gray-400  font-bold sm:text-sm rounded-lg  block w-full p-2.5"
          required=""
        />
        {errors.password && (
          <small className="text-red-500 font-bold text-sm ">
            This field is required
          </small>
        )}
      </div>
      <div className="flex gap-4 items-center">
        <Link
          href="/forgot-password"
          className="shrink-0 text-sm text-blue-400 backdrop-md  hover:underline"
        >
          Forgot Password?
        </Link>
        {loading ? (
          <button
            disabled
            type="button"
            className="w-full text-white bg-indigo-600 rounded-lg text-sm px-5 py-2.5 text-center mr-2  inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 mr-3 text-gray-900 animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Logging in...
          </button>
        ) : (
          <button
            type="submit"
            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all ease-in-out font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Login
          </button>
        )}
      </div>
      <div className="flex items-center ">
        <div className="w-full bg-blue-400 font-bold  h-[1px]"></div>
        <span className="mx-2 text-blue-400 font-bold">or</span>
        <div className="w-full bg-blue-400 font-bold  h-[1px]"></div>
      </div>
      <div className="">
        {/* <button
          type="button"
          className="w-full text-slate-950 bg-white hover:bg-slate-50 focus:ring-4 focus:outline-none focus:ring-slate-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center justify-center flex items-center dark:focus:ring-slate-100 me-2 mb-4 border border-slate-200"
          onClick={() => signIn("google")}
        >
          <FaGoogle className="mr-2 text-red-700 font-bold w-4 h-4" />
          Sign in with Google
        </button> */}
        {/* <button
          onClick={() => signIn("github")}
          type="button"
          className="w-full justify-center text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
        >
        //   Icon
          <FaGithub className="mr-2 w-4 h-4" />
          Sign in with Github
        </button> */}
      </div>

      <p className="text-sm font-light text-white">
        Dont have an account?{" "}
        <Link
          href="/register"
          className="text-blue-400 backdrop-md  hover:underline "
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
