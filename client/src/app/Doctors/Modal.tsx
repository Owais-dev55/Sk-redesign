"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation" 
import { toast } from "react-toastify"
import { useCallback } from "react"

interface User {
  name: string
  email: string
  role: string
}

interface Doctor {
  id: string
  name: string
  speciality: string
}

const AppointmentForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams() 
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true) 
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [doctors, setDoctors] = useState<Doctor[]>([]) 
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false) 

  console.log(user)

const checkAuth = useCallback(() => {
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  if (!storedUser || !token) {
    toast.error("You need to login first.")
    router.replace("/login")
    return false
  }

  try {
    const parsedUser: User = JSON.parse(storedUser)
    if (parsedUser.role !== "PATIENT") {
      toast.error("Access denied. Only patients can book appointments.")
      router.replace("/login")
      return false
    }

    setUser(parsedUser)
    setIsAuthorized(true)
    return true
  } catch (error) {
    console.error("Invalid user in localStorage:", error)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
    toast.error("Session expired or invalid. Please log in again.")
    router.replace("/login")
    return false
  }
}, [router]) 


  useEffect(() => {
    const initPage = async () => {
      setLoading(true)
      const authOk = checkAuth()
      if (!authOk) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch("http://localhost:3000/api/auth/doctors") 
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.message || "Failed to load doctors.")
          setDoctors([])
        } else {
          setDoctors(data.doctors || [])
          const doctorIdFromUrl = searchParams.get("doctorId")
          if (doctorIdFromUrl && data.doctors.some((d: Doctor) => d.id === doctorIdFromUrl)) {
            setSelectedDoctor(doctorIdFromUrl)
          }
        }
      } catch (error) {
        toast.error("Something went wrong while fetching doctors." + error)
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }
    initPage()
  }, [checkAuth, searchParams]) 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor || !date || !time) {
      toast.error("Please fill all the fields.")
      return
    }

    setIsSubmitting(true) 
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        toast.error("Authentication token missing. Please log in again.")
        router.replace("/login")
        return
      }

      const res = await fetch("http://localhost:3000/api/appointments/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doctorId: selectedDoctor, date, time }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Booking failed.")
        return
      }

      toast.success("Appointment booked successfully!")
      router.push("/dashboard/appointments")
    } catch (err) {
      console.error("Appointment booking error:", err)
      toast.error("Something went wrong during booking.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading appointment form...</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">Not authorized. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Book Your Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">
              Select Doctor
            </label>
            <select
              id="doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Choose a Doctor --</option>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} ({doctor.speciality})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No doctors available
                </option>
              )}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading || doctors.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AppointmentForm
