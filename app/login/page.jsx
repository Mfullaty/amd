import LoginForm from "@/components/auth/LoginForm";
import React from "react";

export default function Login() {
  return (
    <section>
      <div className="flex flex-col items-center bg-gradient-to-tl from-indigo-400 via-blue-900 to-black to-45% justify-center px-4 mx-auto min-h-screen">
        <div className="w-full backdrop-blur-md bg-gray-500/30 rounded-lg shadow-2xl  md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-50 drop-shadow-lg md:text-2xl text-center">
              Sign in to your account
            </h1>
            
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}