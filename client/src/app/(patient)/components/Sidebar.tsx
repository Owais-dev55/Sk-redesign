"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaCalendarAlt, FaUser, FaHome, FaBars, FaTimes } from "react-icons/fa"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const linkClasses = (path: string) =>
    `flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2 rounded-md transition text-sm sm:text-base ${
      pathname === path ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
    }`

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleMobileMenu} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 h-auto w-56 bg-white shadow-lg p-3 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:w-64 md:p-4 md:shadow-lg lg:w-72`}
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-4 sm:mb-6 mt-14 md:mt-0">
          Patient Dashboard
        </h2>
        <nav className="flex flex-col gap-1 sm:gap-2">
          <Link href="/dashboard" className={linkClasses("/dashboard")} onClick={() => setIsMobileMenuOpen(false)}>
            <FaHome className="w-4 h-4 sm:w-5 sm:h-5" /> Dashboard
          </Link>
          <Link
            href="/dashboard/appointments"
            className={linkClasses("/dashboard/appointments")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" /> My Appointments
          </Link>
          <Link
            href="/dashboard/profile"
            className={linkClasses("/dashboard/profile")}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUser className="w-4 h-4 sm:w-5 sm:h-5" /> Profile
          </Link>
        </nav>
      </aside>
    </>
  )
}
