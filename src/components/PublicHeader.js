import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../logo.svg";

function PublicHeader() {
  const location = useLocation();
  const publicPaths = ["/", "/login", "/register"];
  if (!publicPaths.includes(location.pathname)) return null;

  return (
    <header className="w-full flex justify-center items-center py-4 bg-white shadow-md fixed top-0 left-0 z-50">
      <Link to="/">
        <Logo
          className="h-12 w-12"
          style={{ width: "200px", height: "100px" }}
        />
      </Link>
    </header>
  );
}

export default PublicHeader;
