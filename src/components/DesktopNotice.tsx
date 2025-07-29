import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreenButton } from "@fortawesome/free-solid-svg-icons";

const DesktopNotice = () => (
  <div className="hidden sm:flex  flex-col fixed inset-0 z-50 items-center justify-center bg-white text-black text-xl font-semibold w-full">
    <FontAwesomeIcon icon={faMobileScreenButton} size="10x" />
    <p className="w-1/2  text-center m-4">
      This app is designed for mobile view only. Please open it on your phone or
      resize your browser window.
    </p>
  </div>
);

export default DesktopNotice;
