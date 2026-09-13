import { Link } from "react-router-dom";
import twLogo from "@/assets/tw logo.jpg";

const Logo = (props: { url?: string; size?: string; className?: string }) => {
  const { url = "/", size = "size-7", className = "" } = props;
  return (
    <div className={`flex items-center justify-center sm:justify-start ${className}`}>
      <Link to={url} className="flex items-center">
        <img
          src={twLogo}
          alt="TeamWork Logo"
          className={`${size} rounded-md object-contain`}
        />
      </Link>
    </div>
  );
};

export default Logo;
