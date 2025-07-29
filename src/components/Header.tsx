import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import SignInModal from "./SignInModal";
import { HeaderSkeleton } from "./Skeleton";

const Header = ({ isLoading }: { isLoading: boolean }) => {
  const { user } = useAuth();

  if (isLoading) return <HeaderSkeleton />;
  return (
    <div className="flex justify-between py-7">
      <div className="flex">
        <FontAwesomeIcon
          icon={faCircleUser}
          size="3x"
          className=" text-black dark:text-white w-12 h-12"
        />
        <h1 className=" m-3 dark:text-white">
          {user
            ? "Welcome back, Roy"
            : !isLoading
            ? "Guest mode. Please log in."
            : "Welcome back, Roy"}
        </h1>
      </div>
      <SignInModal />
    </div>
  );
};

export default Header;
