import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import relasto_logo from "../assets/images/relasto-logo.png";

export function Navbar() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [search, setSearch] = useState("");

  const getUserFromStorage = () => {
    const userData =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const userData = getUserFromStorage();
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === null) {
        const userData = getUserFromStorage();
        setUser(userData);
      }
    };

    const handleAuthChange = () => {
      const userData = getUserFromStorage();
      setUser(userData);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    sessionStorage.removeItem("user");
    setUser(null);
    setIsDropdownOpen(false);

    window.dispatchEvent(new Event("authChange"));

    navigate("/", { replace: true });
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?q=${search}`);
    }
  };

  const handleScroll = () => {
    const el = document.getElementById("featured-properties");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getProfileDisplay = () => {
    if (user?.profile_photo) {
      return (
        <img
          src={user.profile_photo}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <div class="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-lg border-2 border-gray-300">
                ${getInitials()}
              </div>
            `;
          }}
        />
      );
    } else {
      return (
        <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-lg border-2 border-gray-300">
          {getInitials()}
        </div>
      );
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={relasto_logo} alt="Relasto Logo" className="w-32 mb-2" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-gray-700">
          <Link to="/" className="hover:text-orange-500 transition">
            Home
          </Link>
          <Link to="/properties" className="hover:text-orange-500 transition">
            Listing
          </Link>
          <Link to="/agents" className="hover:text-orange-500 transition">
            Agents
          </Link>
          <Link to="/blog" className="hover:text-orange-500 transition">
            Blog
          </Link>
          <Link
            to="/#featured-properties"
            className="hover:text-orange-500 transition"
            onClick={handleScroll}
          >
            Property
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center border rounded-lg px-3 py-1">
            <FaSearch className="text-gray-500" />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              className="outline-none ml-2"
            />
          </div>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {getProfileDisplay()}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.first_name && user?.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user?.email || user?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                  </div>

                  <Link
                    to={
                      user?.role === "agent" ? `/agent/${user.id}` : "/profile"
                    }
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>

                  <div className="border-t border-gray-200 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-900 text-white px-6 py-2 rounded-md text-sm hover:bg-gray-800 transition"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
