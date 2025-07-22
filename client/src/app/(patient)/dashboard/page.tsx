"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {  FaCalendarAlt, FaCalendarPlus, FaUser } from "react-icons/fa"
import CustomLoader from "@/components/Loader/CustomLoader"

interface User {
  name: string
  email: string
  role: string
}

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("token")

      if (!storedUser || !token) {
        router.replace("/login")
        return
      }

      try {
        const parsedUser: User = JSON.parse(storedUser)
        if (parsedUser.role !== "PATIENT") {
          router.replace("/")
          return
        }
        setUser(parsedUser)
        setIsAuthorized(true)
      } catch (error) {
        console.error("Invalid user in localStorage:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        router.replace("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CustomLoader />
      </div>
    )
  }

  if (!isAuthorized || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="w-full max-w-none sm:max-w-6xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-4 sm:mb-8">
          <div className="w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <FaUser className="w-5 h-5 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
          </div>
          <h1 className="text-lg sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 capitalize leading-tight">
            Welcome back, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 text-xs sm:text-base">Manage your healthcare journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          <Link
            href="/dashboard/appointments"
            className="group bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-2 sm:mr-4 group-hover:bg-blue-200 transition-colors">
                <FaCalendarAlt className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h2 className="text-sm sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                My Appointments
              </h2>
            </div>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors text-xs sm:text-base">
              View and manage your upcoming and past appointments with healthcare providers.
            </p>
          </Link>

          <Link
            href="/dashboard/book"
            className="group bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mr-2 sm:mr-4 group-hover:bg-green-200 transition-colors">
                <FaCalendarPlus className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h2 className="text-sm sm:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
                Book Appointment
              </h2>
            </div>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors text-xs sm:text-base">
              Schedule a new appointment with your preferred doctor or specialist.
            </p>
          </Link>

          <Link
            href="/dashboard/profile"
            className="group bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-2 sm:mr-4 group-hover:bg-purple-200 transition-colors">
                <FaUser className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h2 className="text-sm sm:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                My Profile
              </h2>
            </div>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors text-xs sm:text-base">
              Update your personal information, contact details, and account settings.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
