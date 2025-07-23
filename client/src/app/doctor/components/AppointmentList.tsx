"use client"
import { FaCalendarAlt, FaCheckCircle, FaClock, FaExclamationCircle, FaTimesCircle, FaUser } from "react-icons/fa"
import { toast } from "react-toastify"
import RescheduleModal from "./ResheduleModal"
import { useState } from "react"
import { API_BASE_URL } from "@/constants/constants"
import { useRouter } from "next/navigation"
import { PiChatCircleDuotone } from "react-icons/pi"

interface Appointment {
  id: string
  date: string
  time: string
  status: string
  type?: string
  notes?: string
  patient: {
    id: string
    name: string
    email: string
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return <FaCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
    case "upcoming":
      return <FaExclamationCircle className="w-3.5 h-3.5 text-amber-600" />
    case "cancelled":
      return <FaTimesCircle className="w-3.5 h-3.5 text-red-600" />
    default:
      return <FaClock className="w-3.5 h-3.5 text-slate-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "upcoming":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}
export default function AppointmentList({
  appointments,
  refetch,
}: {
  appointments: Appointment[]
  refetch: () => void
}) {
  const router = useRouter()
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleChatClick = (patientId: string) => {
    router.push(`/doctor/chat/${patientId}`)
    console.log(patientId)
  }

  const openModal = (id: string) => {
    setSelectedAppointmentId(id)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedAppointmentId(null)
    setShowModal(false)
  }

  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/doctor/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to cancel appointment")
        return
      }
      toast.success("Appointment cancelled")
      refetch()
    } catch (error) {
      toast.error("Something went wrong" + error)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/doctor/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to approve appointment")
        return
      }
      toast.success("Appointment approved")
      refetch()
    } catch (error) {
      toast.error("Something went wrong" + error)
    }
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const dateObj = new Date(appointment.date)
        const date = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
        const time = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        const isUpcoming = dateObj > new Date()

        return (
          <div
            key={appointment.id}
            className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 ${
              isUpcoming ? "border-l-4 border-l-blue-500" : "border-slate-200"
            }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <FaUser className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {appointment.patient?.name || "Unknown Patient"}
                    </h3>
                    <p className="text-sm text-slate-600">{appointment.patient?.email}</p>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(
                    appointment.status,
                  )}`}
                >
                  {getStatusIcon(appointment.status)}
                  <span className="capitalize">{appointment.status}</span>
                </div>
              </div>
               <div className="flex items-center gap-6 mb-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  <span>{time}</span>
                </div>
                {appointment.type && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                    {appointment.type}
                  </span>
                )}
              </div>
               {appointment.notes && (
                <div className="mb-3 p-2.5 bg-amber-50 rounded border border-amber-100">
                  <p className="text-xs text-amber-700">{appointment.notes}</p>
                </div>
              )}
              {isUpcoming && ["upcoming", "reschedule"].includes(appointment.status.toLowerCase()) && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {appointment.status.toLowerCase() === "upcoming" && (
                        <>
                          <button
                            onClick={() => handleApprove(appointment.id)}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openModal(appointment.id)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancel(appointment.id)}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleChatClick(appointment.patient.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <PiChatCircleDuotone className="w-4 h-4" />
                      Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
      {showModal && selectedAppointmentId && (
        <RescheduleModal appointmentId={selectedAppointmentId} onClose={closeModal} refetch={refetch} />
      )}
    </div>
  )
}
