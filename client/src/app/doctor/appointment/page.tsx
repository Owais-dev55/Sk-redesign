"use client"
import { useEffect, useState } from "react"
import AppointmentList from  "../components/AppointmentList" 
import AppointmentStats from "../components/AppointmentStats"
import { API_BASE_URL } from "@/constants/constants"
import CustomLoader from "@/components/Loader/CustomLoader"

interface Appointment {
  id: string
  date: string
  time: string
  status: string
  type?: string
  notes?: string
  doctor: {
    name: string
    specialty?: string
  }
  patient: {
    id:string
    name: string
    email: string
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/api/appointments/doctor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setAppointments(data.appointments || [])
    } catch (err) {
      console.error("Error fetching appointments:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true
    return appointment.status.toLowerCase() === filter
  })

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.date) > new Date() && apt.status.toLowerCase() === "approved",
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CustomLoader />
      </div>
    )
  }

  return (
    <div className=" bg-gray-50">
      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
        {appointments.length > 0 && (
          <AppointmentStats appointments={appointments} upcomingCount={upcomingAppointments.length} />
        )}
        {appointments.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="-mb-px flex space-x-4 sm:space-x-8">
                {["all", "approved", "pending", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                      filter === status
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {status} (
                    {status === "all"
                      ? appointments.length
                      : appointments.filter((apt) => apt.status.toLowerCase() === status).length}
                    )
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-12 text-center border border-gray-200">
           <h1>No appointments yet.</h1>
          </div>
        ) : (
          <AppointmentList appointments={filteredAppointments} refetch={fetchAppointments} />
          
        )}
        {filteredAppointments.length === 0 && appointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200">
            <p className="text-gray-600 text-sm sm:text-base">No appointments found for the selected filter.</p>{" "}
            
          </div>
        )}
      </div>
    </div>
  )
}
