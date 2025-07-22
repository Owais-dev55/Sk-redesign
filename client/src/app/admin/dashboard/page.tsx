"use client"

import { JSX, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import CustomLoader from "@/components/Loader/CustomLoader"
import {
  FaUsers,
  FaStethoscope,
  FaCalendarAlt,
  FaChartLine
} from "react-icons/fa"
import { API_BASE_URL } from "@/constants/constants"

interface DashboardStats {
  totalDoctors: number
  totalAppointments: number
  newUsers: number
  activePatients: number
}

interface User {
  role: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const checkAuthAndFetchStats = async () => {
      const userString = localStorage.getItem("user")
      const token = localStorage.getItem("token")

      if (!userString || !token) {
        router.replace("/login")
        setLoading(false)
        return
      }

      try {
        const parsedUser: User = JSON.parse(userString)
        if (parsedUser.role !== "ADMIN") {
          router.replace("/")
          setLoading(false)
          return
        }

        setUser(parsedUser)
        setIsAuthorized(true)

        const res = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!res.ok) throw new Error("Failed to fetch stats")
        const data: DashboardStats = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        router.replace("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchStats()
  }, [router])

  if (loading || !stats || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <CustomLoader />
      </div>
    )
  }

  if (!isAuthorized) return null

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DashboardCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={<FaStethoscope className="h-5 w-5 text-gray-500" />}
            note="+20% from last month"
          />

          <DashboardCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<FaCalendarAlt className="h-5 w-5 text-gray-500" />}
            note="+15% from last month"
          />

          <DashboardCard
            title="New Users"
            value={stats.newUsers}
            icon={<FaUsers className="h-5 w-5 text-gray-500" />}
            note="+5% from last month"
          />

          <DashboardCard
            title="Active Patients"
            value={stats.activePatients}
            icon={<FaChartLine className="h-5 w-5 text-gray-500" />}
            note="Currently active"
          />
        </div>
      </div>
    </div>
  )
}

function DashboardCard({
  title,
  value,
  icon,
  note
}: {
  title: string
  value: number
  icon: JSX.Element
  note: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-gray-500">{note}</p>
    </div>
  )
}
