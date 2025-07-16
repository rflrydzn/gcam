"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import GearDropdown from "./GearDropdown";

export default function SignInModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsOpen(false);
    } catch (err) {
      alert("Login failed.");
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <>
      {/* Button */}
      {!user ? (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSignIn}
                className="px-6 py-3 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4"
              >
                Log In
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-[#1A1A1A] text-white rounded-3xl text-[14px] leading-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}