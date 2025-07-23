import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser, faMoon, faRightFromBracket, faSun } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { globalLoadingAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";

export default function GearDropdown({openSignIn} : {openSignIn: () => void}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const setIsGlobalLoading = useSetAtom(globalLoadingAtom)
  const {user} = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
  setIsGlobalLoading(true);
  try {
    await signOut(auth);

    // 👇 Artificial delay so loader is visible
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    setIsGlobalLoading(false);
  }
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
    <div className="relative inline-block text-left " ref={dropdownRef}>

      
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200 transition"
      >
        <FontAwesomeIcon icon={faGear} size="lg" className="dark:text-white"/>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden dark:bg-primary-dark">
          {/* Account section */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:text-white">
            <FontAwesomeIcon icon={faUser} />
            Profile Settings
          </button>

          {/* Divider */}
          <hr className="my-1 border-gray-200" />

          {/* Theme toggle */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
          onClick={() => 
                  setTheme(theme === 'light' ? 'dark' : 'light')
                }>
            {theme === 'light' ? (<>
            <FontAwesomeIcon icon={faMoon} />
            Dark Mode</>) : (<div className="dark:text-white"><FontAwesomeIcon icon={faSun} /> Light Mode</div>)}
            
          </button>

          {/* Divider */}
          <hr className="my-1 border-gray-200" />

          {/* Sign out */}
          <button
            onClick={() => {
              if (!user) {
                openSignIn()
              } else {
                handleSignOut();
                setOpen(false);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${!user ? 'text-blue-600 hover:bg-blue-60' : 'text-red-600 hover:bg-red-50'}`}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            {!user ? 'Sign In' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
}