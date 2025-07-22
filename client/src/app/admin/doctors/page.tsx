"use client"
import { useEffect, useState } from "react"
import DoctorAppointmentsModal from "../components/DoctorAppointmentsModal"
import { API_BASE_URL } from "@/constants/constants"
import { toast } from "react-toastify"
import CustomLoader from "@/components/Loader/CustomLoader"
import Image from "next/image"
interface Doctor {
  id: string
  name: string
  email: string
  speciality: string
  role: string
  image: string | null
  createdAt: string
  _count: {
    doctorAppointments: number
  }
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("No token found")
      setLoading(false)
      return
    }

    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/doctors`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.message || "Failed to fetch doctors")
          return
        }
        setDoctors(data.doctors || [])
      } catch (err) {
        console.error("Error fetching doctors:", err)
        toast.error("Something went wrong while fetching doctors.")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const handleDelete = async (doctorId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("No token found")
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/doctors/${doctorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to delete doctor")
        return
      }
      toast.success("Doctor deleted successfully")
      setDoctors((prev) => prev.filter((doc) => doc.id !== doctorId))
    } catch (err) {
      console.error("Error deleting doctor:", err)
      toast.error("Something went wrong while deleting the doctor.")
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-bold leading-none tracking-tight">All Doctors</h2>
        </div>
        <div className="p-6 pt-0">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <CustomLoader />
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-auto caption-bottom text-sm whitespace-nowrap min-w-max rounded-md overflow-hidden">
                  <thead className="[&_tr]:border-b">
                    <tr className="bg-gray-50 text-gray-700">
                      <th className="px-6 py-3 text-left">Image</th>
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Specialization</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Created At</th>
                      <th className="px-6 py-3 text-center">Appointments</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-6 text-gray-500">
                          No doctors found.
                        </td>
                      </tr>
                    ) : (
                      doctors.map((doctor) => (
                        <tr key={doctor.id} className="border-t hover:bg-gray-100 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <Image
                              src={
                                doctor.image ||
                                "/icon-7797704_1280.png" 
                              }
                              alt={doctor.name}
                              className="h-10 w-10 rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                          </td>
                          <td className="px-6 py-4 font-medium max-w-[180px] truncate">{doctor.name}</td>
                          <td className="px-6 py-4 max-w-[220px] truncate">{doctor.email}</td>
                          <td className="px-6 py-4 max-w-[180px] truncate">{doctor.speciality}</td>
                          <td className="px-6 py-4">{doctor.role}</td>
                          <td className="px-6 py-4">{new Date(doctor.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setSelectedDoctorId(doctor.id)}
                              className="inline-flex items-center text-blue-600 hover:underline"
                            >
                              View ({doctor._count.doctorAppointments})
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDelete(doctor.id)}
                              className="inline-flex items-center text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden space-y-4">
                {doctors.length === 0 ? (
                  <p className="text-center text-gray-500">No doctors found.</p>
                ) : (
                  doctors.map((doctor) => (
                    <div key={doctor.id} className="border rounded-lg p-4 shadow-sm flex flex-col gap-3 bg-white">
                      <div className="flex items-center gap-4 mb-2">
                        <Image
                          src={doctor.image || "/icon-7797704_1280.png"}
                          alt={doctor.name}
                          className="h-12 w-12 rounded-full object-cover"
                          width={48}
                          height={48}
                        />
                        <div>
                          <p className="font-semibold text-lg">{doctor.name}</p>
                          <p className="text-sm text-gray-600">{doctor.email}</p>
                        </div>
                      </div>
                      <p>
                        <span className="font-medium">Specialization:</span> {doctor.speciality}
                      </p>
                      <p>
                        <span className="font-medium">Role:</span> {doctor.role}
                      </p>
                      <p>
                        <span className="font-medium">Joined:</span> {new Date(doctor.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Appointments:</span>{" "}
                        <button
                          onClick={() => setSelectedDoctorId(doctor.id)}
                          className="text-blue-600  cursor-pointer"
                        >
                          View ({doctor._count.doctorAppointments})
                        </button>
                      </p>
                      <button onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:underline w-fit cursor-pointer">
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {selectedDoctorId && (
        <DoctorAppointmentsModal doctorId={selectedDoctorId} onClose={() => setSelectedDoctorId(null)} />
      )}
    </div>
  )
}
