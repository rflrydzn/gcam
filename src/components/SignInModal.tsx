"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import GearDropdown from "./GearDropdown";
import PulseLoader from "./PulseLoader";
import { useAtomValue, useSetAtom } from "jotai";
import { globalLoadingAtom } from "@/lib/atoms";

export default function SignInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false)
  const { user } = useAuth();
const setGlobalLoading = useSetAtom(globalLoadingAtom);
const isGlobalLoading = useAtomValue(globalLoadingAtom)
const isLoading = useAtomValue(globalLoadingAtom);

  const handleSignIn = async () => {

    setGlobalLoading(true);
    
    try {
        await setPersistence(
      auth,
      rememberMe ? browserLocalPersistence : browserSessionPersistence
    );
      await signInWithEmailAndPassword(auth, email, password);
      setIsOpen(false);
    } catch (err) {
      alert("Login failed.");
      console.error(err);
    } finally {

        setTimeout(() => {
            setGlobalLoading(false)
        }, 2000)
    }
  };


  return (
    <>
          {isGlobalLoading && <PulseLoader />} {/* 👈 Show loader when loading */}

      {/* Button */}
      {!user && !isLoading ? (
        <button
          className="px-6 py-3  border-[#1A1A1A] border rounded-3xl text-[14px] leading-4"
          onClick={() => setIsOpen(true)}
        >
          Sign In
        </button>
      ) : (
        <GearDropdown />
        
      )}
    
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50  ">
          <div className="bg-white rounded-lg w-full p-6 space-y-6 h-[500px]">
            <h2 className="text-2xl font-bold ">Log In</h2>
            <div className="">
                <label className="mb-2.5 block">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded-4xl border-[#B3B3B3]"
            />
            </div>
            <div>
                <label className="mb-2.5 block">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-4xl border-[#B3B3B3]"
            />
            </div>
            <label className="flex items-center space-x-2 text-sm">
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={() => setRememberMe(!rememberMe)}
    className="form-checkbox"
  />
  <span>Remember me</span>
</label>
            <div className="flex justify-between">
              <button
                onClick={handleSignIn}
                className="px-6 py-3 bg-[#1A1A1A] text-white rounded-md text-[14px] leading-4 w-full"
              >
                Log In
              </button>
              {/* <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4"
              >
                Cancel
              </button> */}
            </div>

            
          </div>
        </div>
      )}
    </>
  );
}