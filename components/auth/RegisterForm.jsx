"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FaGithub, FaGoogle } from "react-icons/fa";
import parsePhoneNumberFromString from "libphonenumber-js";
import SelectInput from "../FormInputs/SelectInput";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import AppIcon from "../dashboard/AppIcon";
import { CldUploadWidget } from "next-cloudinary";

const countryOptions = [
  { id: "NG", title: "Nigeria" },
  { id: "US", title: "United States" },
  { id: "KE", title: "Kenya" },
  { id: "ZA", title: "South Africa" },
  { id: "GH", title: "Ghana" },
  // Add more countries as needed
];

export default function RegisterForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const sessionUser = session?.user;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [image, setImage] = useState("");

  const handleUpload = (result) => {
    const uploadedUrl = result.info.secure_url;
    console.log(uploadedUrl);
    setImage(uploadedUrl);
  };

  const [loadingStates, setLoadingStates] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(true);

  useEffect(() => {
    setShowUploadButton(!image);
  }, [image]);

  const removeImage = async (url) => {
    setLoadingStates(true);
    try {
      // Call your API to delete the image from Cloudinary
      const response = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({url}),
      });

      if (!response.ok) {
        throw new Error("Failed to delete image from Cloudinary");
      }

      toast.success("Removed Image");

      // Remove the image from the local state
      setImage("");
    } catch (error) {
      console.error("Error Deleting image:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  async function onSubmit(data) {
    data.image = image;
    try {
      console.log(data);
      setLoading(true);

      const phoneNumber = parsePhoneNumberFromString(data.phone, data.country);
      if (!phoneNumber?.isValid()) {
        setLoading(false);
        setPhoneErr("Invalid phone number");
        toast.error("Invalid phone number");
        return;
      }

      data.phone = phoneNumber.formatInternational();

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setLoading(false);
        toast.success("User Created Successfully");
        reset();
        router.push("/login");
      } else {
        setLoading(false);
        if (response.status === 409) {
          setEmailErr("User with email or phone already exists!");
          setEmailErr("User phone or email already exists!");
          toast.error("User already exists!");
        } else {
          // Handle other errors
          console.error("Server Error:", responseData.message);
          toast.error("Oops Something Went wrong");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Something Went wrong, Please Try Again");
    }
  }

  if (status === "authenticated" || sessionUser) {
    return router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-center items-center w-full">
        {image !== "" && (
          <div className="relative">
            <Avatar className="w-24 h-24 cursor-pointer hover:bg-foreground">
              <AvatarImage src={image} className="object-cover" alt="user image"></AvatarImage>
              <AvatarFallback>
                <AppIcon icon="CircleUser" className="text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            {loadingStates && (
              <div className="absolute top-1 right-1">
                <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />
              </div>
            )}

            {!loadingStates && (
              <button
                onClick={() => removeImage(image)}
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <AppIcon icon="X" className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        {/* The uplaod widget */}
        <CldUploadWidget
          uploadPreset="q8vfxsqh"
          onSuccess={handleUpload}
          options={{
            multiple: false,
            maxFiles: 1,
            maxImageFileSize: 8500000,
            maxFileSize: 8500000,
            resourceType: "image",
            clientAllowedFormats: ["image"],
            maxRawFileSize: 8500000,
            cropping: true,
            sources: ["local", "camera"],
          }}
        >
          {({ open }) =>
            showUploadButton && (
              <Avatar
                onClick={(e) => {
                  e.preventDefault();
                  open();
                }}
                className="w-24 h-24 cursor-pointer hover:bg-foreground"
              >
                <AvatarImage src={image} alt="user image"></AvatarImage>
                <AvatarFallback>
                  <AppIcon
                    icon="CircleUser"
                    className="text-muted-foreground"
                  />
                </AvatarFallback>
              </Avatar>
            )
          }
        </CldUploadWidget>
      </div>
      <div>
        {/* <label
          htmlFor="name"
          className="block mb-2 text-sm font-medium  text-gray-50"
        >
          Your name
        </label> */}
        <input
          {...register("name", { required: true })}
          type="text"
          name="name"
          id="name"
          className="bg-transparent/50 outline-none focus:outline-white focus:outline-1  text-white placeholder:font-normal placeholder:text-gray-400  font-bold sm:text-sm rounded-lg  block w-full p-2.5"
          placeholder="Full Name"
          required=""
        />
        {errors.name && (
          <small className="text-red-500 font-bold text-sm ">
            This field is required
          </small>
        )}
      </div>
      <div>
        {/* <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium  text-gray-50"
        >
          Your email
        </label> */}
        <input
          {...register("email", { required: true })}
          type="email"
          name="email"
          id="email"
          className="bg-transparent/50 outline-none focus:outline-white focus:outline-1  text-white placeholder:font-normal placeholder:text-gray-400  font-bold sm:text-sm rounded-lg  block w-full p-2.5"
          placeholder="yourname@example.com"
          required=""
        />
        {errors.email && (
          <small className="text-red-500 font-bold text-sm ">
            This field is required
          </small>
        )}
        <small className="text-red-500 font-bold text-sm ">{emailErr}</small>
      </div>
      <div>
        <SelectInput
          className="col-span-2 w-full  bg-transparent/50 outline-none focus:outline-white focus:outline-1 text-muted-foreground placeholder:font-normal placeholder:text-gray-400  sm:text-sm rounded-lg  block  p-2.5"
          name="country"
          register={register}
          options={countryOptions}
        />
        {errors.country && (
          <small className="text-red-500 font-bold text-sm ">
            This field is required
          </small>
        )}
      </div>
      <div>
        <input
          {...register("phone", { required: true })}
          type="text"
          name="phone"
          id="phone"
          className="bg-transparent/50 outline-none focus:outline-white focus:outline-1  text-white placeholder:font-normal placeholder:text-gray-400  font-bold sm:text-sm rounded-lg  block w-full p-2.5"
          placeholder="Phone Number (+234 813849768)"
          required=""
        />
        {errors.phone && (
          <small className="text-red-500 font-bold text-sm ">
            This field is required
          </small>
        )}
        <small className="text-red-500 font-bold text-sm ">{phoneErr}</small>
      </div>
      <div>
        {/* <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium  text-gray-50"
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
      {loading ? (
        <button
          disabled
          type="button"
          className="w-full text-white bg-indigo-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2  inline-flex items-center"
        >
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 mr-3 text-white animate-spin"
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
          Registering...
        </button>
      ) : (
        <button
          type="submit"
          className="w-full text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all ease-in-out  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Sign Up
        </button>
      )}
      <div className="flex items-center ">
        <div className="w-full bg-blue-400 font-bold  h-[1px]"></div>
        <span className="mx-2 text-blue-400 font-bold">or</span>
        <div className="w-full bg-blue-400 font-bold  h-[1px]"></div>
      </div>
      <div className="">
        {/* <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full text-slate-950 bg-white hover:bg-slate-50 focus:ring-4 focus:outline-none focus:ring-slate-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center justify-center flex items-center  me-2 mb-4 border border-slate-200"
        >
          <FaGoogle className="mr-2 text-red-600 w-4 h-4" />
          Sign up with Google
        </button> */}
        {/* <button
          type="button"
          onClick={() => signIn("github")}
          className="w-full justify-center text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2"
        >
        //   Icon
          <FaGithub className="mr-2 w-4 h-4" />
          Sign up with Github
        </button> */}
      </div>
      <p className="text-sm font-light text-white">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-400 backdrop-md  hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
