"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaStethoscope, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/slices/userSlice";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(setUser(null));
    setIsDropdownOpen(false);
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <FaStethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Health<span className="text-red-600">Care+</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-links">
              Home
            </Link>
            <Link href="/Service" className="nav-links">
              Services
            </Link>
            <Link href="/Doctors" className="nav-links">
              Doctors
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div
                className="relative hidden sm:flex items-center space-x-3 "
                ref={dropdownRef}
              >
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer"
                >
                  <Image
                    src={user?.image || "/icon-7797704_1280.png"}
                    alt="user-image"
                    width={25}
                    height={25}
                    className="rounded-xl"
                  />
                  <span className="text-gray-700 font-medium text-sm">
                    {user.role === "DOCTOR"
                      ? user.name.toLowerCase().startsWith("dr.")
                        ? user.name
                        : `Dr. ${user.name}`
                      : user.name}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          if (user.role === "PATIENT") {
                            router.push("/dashboard");
                          } else {
                            router.push("/doctor/dashboard");
                          }
                        }}
                        className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors duration-150 group cursor-pointer"
                      >
                        Go to Dashboard
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 text-sm transition-colors duration-150 group cursor-pointer"
                      >
                       
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link href="/login" className="nav-links">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FaTimes className="w-6 h-6" />
                ) : (
                  <FaBars className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-2 bg-gray-50 rounded-lg px-4 py-3 space-y-2">
            <Link
              href="/"
              className="nav-link-mob"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/Service"
              className="nav-link-mob"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/doctors"
              className="nav-link-mob"
              onClick={() => setIsMenuOpen(false)}
            >
              Doctors
            </Link>
            <div className="border-t border-gray-200 pt-3 mt-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <Image
                      src={user?.image || "/icon-7797704_1280.png"}
                      alt="user-image"
                      width={30}
                      height={30}
                      className="rounded-xl"
                    />
                    <span className="text-gray-700 font-medium">
                      Welcome,{" "}
                      {user.role === "DOCTOR"
                        ? user.name.toLowerCase().startsWith("dr.")
                          ? user.name
                          : `Dr. ${user.name}`
                        : user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/dashboard");
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-3 py-2 w-full text-left"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="nav-link-mob"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white block px-3 py-2 text-base font-medium rounded-md hover:bg-blue-700 mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
