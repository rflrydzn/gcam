import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";

const DesktopNotice = () => (
  <div className="hidden sm:flex  flex-col fixed inset-0 z-50 items-center justify-center bg-white text-black text-xl font-semibold w-full">
    <FontAwesomeIcon icon={faGears} size="10x" />
    <p className="w-1/  text-center m-4">
      App is meant to be viewed on mobile or tablet
    </p>
  </div>
);

export default DesktopNotice;
