"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
// import { useAuth } from "@/hooks/useAuth";
import GearDropdown from "./GearDropdown";
import PulseLoader from "./PulseLoader";
import { useAtomValue, useSetAtom } from "jotai";
import { globalLoadingAtom } from "@/lib/atoms";
import {useForm, SubmitHandler} from "react-hook-form"
import { FirebaseError } from "firebase/app";

type Inputs = {
  email: string
  password: string
}

export default function SignInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  const [rememberMe, setRememberMe] = useState(false);
  // const { user } = useAuth();
  const setGlobalLoading = useSetAtom(globalLoadingAtom);
  const isGlobalLoading = useAtomValue(globalLoadingAtom);
  // const isLoading = useAtomValue(globalLoadingAtom);
  const {register, handleSubmit, formState : {errors}} = useForm<Inputs>()
  

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setGlobalLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setIsOpen(false);
    } catch (error) {
      const err = error as FirebaseError; 

      if (err.code === "auth/invalid-credential") {
        setErrorMsg("Invalid email or password")       
        } else {
        setErrorMsg("Something went wrong. Please try again.")
        }
    } finally {
      setTimeout(() => {
        setGlobalLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      {isGlobalLoading && <PulseLoader />} {/* 👈 Show loader when loading */}
      {/* Button */}
      
        <GearDropdown openSignIn={() => setIsOpen(true)}/>
      
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 dark:bg-primary-dark ">
          <div className="bg-white rounded-lg w-full p-6 space-y-6 h-[500px] dark:bg-primary-dark">
            <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-bold dark:text-white">Log In</h2>
            <div className="">
              <label className="mb-2.5 block dark:text-white">Email</label>
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
                })}
                className="w-full mb-2 px-3 py-2 border rounded-4xl border-[#B3B3B3] dark:text-white"
              />
              {errors.email && (<p className="text-red-500 text-sm">{errors.email.message}</p>)}
            </div>
            <div>
              <label className="mb-2.5 block dark:text-white">Password</label>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="w-full mb-4 px-3 py-2 border rounded-4xl border-[#B3B3B3] dark:text-white"
              />
              {errors.password && (<p className="text-red-500 text-sm">{errors.password.message}</p>)}
            </div>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox"
              />
              <span className="dark:text-white">Remember me</span>
            </label>
            <div className="flex justify-between">
              <button
              type="submit"
              
                
                className="px-6 py-3 bg-[#1A1A1A] text-white rounded-md text-[14px] leading-4 w-full"
              >
                Log In
              </button>
              
            </div>
                {errorMsg}
            <p onClick={() => setIsOpen(false)} className="text-center text-sm text-gray-600 cursor-pointer hover:underline dark:text-white">
              Continue viewing as a guest.
            </p>
            </form>
          </div>
          
        </div>
      )}
    </>
  );
}
