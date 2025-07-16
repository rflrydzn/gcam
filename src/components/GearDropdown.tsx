import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser, faMoon, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function GearDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        <FontAwesomeIcon icon={faGear} size="lg" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Account section */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
            <FontAwesomeIcon icon={faUser} />
            Profile Settings
          </button>

          {/* Divider */}
          <hr className="my-1 border-gray-200" />

          {/* Theme toggle */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
            <FontAwesomeIcon icon={faMoon} />
            Dark Mode
          </button>

          {/* Divider */}
          <hr className="my-1 border-gray-200" />

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-red-50"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}