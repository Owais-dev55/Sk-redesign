"use client"
import { useEffect, useState } from "react"
import { FaCalendarAlt, FaClock, FaUserMd, FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa"
import { PiChatCircleDuotone } from "react-icons/pi"
import RescheduleModal from "../components/RescheduleModal"
import { toast } from "react-toastify"
import { API_BASE_URL, formatTo12Hour } from "@/constants/constants"
import { useRouter } from "next/navigation"

interface Schedule {
  day: string
  startTime: string
  endTime: string
}

interface Doctor {
  id: string
  name: string
  speciality: string
  image: string
  schedules?: Schedule[]
}

interface Appointment {
  id: string
  doctor: { id: string; name: string; specialty?: string; image: string }
  date: string
  status: string
  type?: string
  notes?: string
}

export default function AppointmentList({
  appointments,
  refetch,
}: {
  appointments: Appointment[]
  refetch: () => void
}) {
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchDoctorSchedules = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/doctors`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.message || "Failed to fetch doctor schedules")
        } else {
          setDoctors(data.doctors || [])
        }
      } catch {
        toast.error("Error fetching schedules")
      }
    }
    fetchDoctorSchedules()
  }, [])

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
      const res = await fetch(`${API_BASE_URL}/api/appointments/cancel/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to cancel appointment")
        return
      }
      toast.success("Appointment cancelled")
      refetch()
    } catch {
      toast.error("Something went wrong")
    }
  }

  const handleChatClick = (doctorId: string) => {
    router.push(`/dashboard/chat/${doctorId}`)
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

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const dateObj = new Date(appointment.date)
        const date = dateObj.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "Asia/Karachi",
        })
        const time = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Karachi",
        })
        const isUpcoming = dateObj > new Date()
        const matchedDoctor = doctors.find((doc) => doc.id === appointment.doctor.id)
        return (
          <div
            key={appointment.id}
            className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 ${
              isUpcoming ? "border-l-4 border-l-blue-500" : "border-slate-200"
            }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FaUserMd className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {appointment.doctor.name.startsWith("Dr")
                        ? appointment.doctor.name
                        : `Dr. ${appointment.doctor.name}`}
                    </h3>
                    {appointment.doctor.specialty && (
                      <p className="text-sm text-slate-600">{appointment.doctor.specialty}</p>
                    )}
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

              {/* Doctor Schedule */}
              {matchedDoctor && Array.isArray(matchedDoctor.schedules) && matchedDoctor.schedules.length > 0 && (
                <div className="mb-3 p-2.5 bg-blue-50 rounded border border-blue-100">
                  <h4 className="text-xs font-semibold text-slate-800 mb-2">Available Hours</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    {matchedDoctor.schedules.map((slot, index) => (
                      <div key={index}>
                        <span className="font-medium">{slot.day}:</span> {formatTo12Hour(slot.startTime)} -{" "}
                        {formatTo12Hour(slot.endTime)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {appointment.notes && (
                <div className="mb-3 p-2.5 bg-amber-50 rounded border border-amber-100">
                  <p className="text-xs text-amber-700">{appointment.notes}</p>
                </div>
              )}

              {/* Actions */}
              {isUpcoming && appointment.status.trim().toLowerCase() === "upcoming" && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(appointment.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <button
                      onClick={() => handleChatClick(appointment.doctor.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
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
