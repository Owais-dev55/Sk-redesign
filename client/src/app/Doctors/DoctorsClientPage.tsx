"use client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { FaSearch, FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaAward } from "react-icons/fa" 
import Image from "next/image"
import Filter from "./FilterDoctors" 
import Appointment from "./BookAppointment" 
import { useSearchParams } from "next/navigation"
interface Doctor {
  id: string
  name: string
  speciality: string
  image: string
}

const DoctorsClientPage = () => {
  const searchParams = useSearchParams()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")

  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDoctorIdForModal, setSelectedDoctorIdForModal] = useState<string | null>(null)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:3000/api/doctors")
        const data = await res.json()
        if (!res.ok) {
          toast.error(data.message || "Failed to load doctors")
          return
        }
        setDoctors(data.doctors || [])
        
        const urlSpecality = searchParams.get("speciality")
         if (urlSpecality) {
        setSelectedSpecialty(urlSpecality)
      }

      } catch (error) {
        toast.error("Something went wrong while fetching doctors." + error)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [searchParams])

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "all" || doctor.speciality === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedSpecialty("all")
  }

  const handleBookAppointmentClick = (doctorId: string) => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!storedUser || !token) {
      toast.error("Please login to book an appointment.")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser.role !== "PATIENT") {
        toast.error("Only patients can book appointments.")
        return
      }
      setSelectedDoctorIdForModal(doctorId)
      setShowBookingModal(true)
    } catch (error) {
      toast.error("Invalid login state. Please login again." + error)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }

  const handleCloseBookingModal = () => {
    setShowBookingModal(false)
    setSelectedDoctorIdForModal(null)
  }

  const DoctorCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="h-64 bg-gray-200 animate-pulse"></div>
      <div className="p-6 space-y-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
      </div>
    </div>
  )

  const EmptyState = ({ onClearFilters }: { onClearFilters: () => void }) => (
    <div className="col-span-full text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <FaSearch className="h-16 w-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No doctors found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search criteria or browse all specialties.</p>
        <button
          onClick={onClearFilters}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )

  const DoctorCard = ({ doctor, onBookClick }: { doctor: Doctor; onBookClick: (doctorId: string) => void }) => (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={doctor.image || "/placeholder.svg?height=300&width=400"}
          alt={doctor.name}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
            <FaStar className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
       {doctor.name.toLowerCase().startsWith("dr.") ? doctor.name : `Dr. ${doctor.name}`}
        </h3>

        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
            {doctor.speciality}
          </span>
        </div>

        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
            <span>Available for consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="h-4 w-4 text-gray-400" />
            <span>Next available: Today</span>
          </div>
        </div>

        <button
          onClick={() => onBookClick(doctor.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Book Appointment
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative py-20 px-4 text-center text-white overflow-hidden"
        style={{ backgroundImage: `url(/stetscope.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Meet Our Expert
            <span className="block text-blue-100">Medical Team</span>
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Dedicated healthcare professionals committed to providing exceptional care with compassion, expertise, and
            cutting-edge medical knowledge.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <FaAward className="h-5 w-5" />
              <span>Board Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="h-5 w-5" />
              <span>Patient Focused</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="h-5 w-5" />
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </section>
      <Filter
        doctors={doctors}
        searchTerm={searchTerm}
        selectedSpecialty={selectedSpecialty}
        setSearchTerm={setSearchTerm}
        setSelectedSpecialty={setSelectedSpecialty}
      />
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {loading
                ? "Loading Our Medical Experts..."
                : `${filteredDoctors.length} Expert${filteredDoctors.length !== 1 ? "s" : ""} Ready to Help`}
            </h2>
            {!loading && (
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose from our carefully selected team of medical professionals, each bringing years of experience and
                specialized expertise to your care.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => <DoctorCardSkeleton key={index} />)
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} onBookClick={handleBookAppointmentClick} />
              ))
            ) : (
              <EmptyState onClearFilters={handleClearFilters} />
            )}
          </div>
        </div>
      </section>
      {showBookingModal && selectedDoctorIdForModal && (
        <Appointment id={selectedDoctorIdForModal} onClose={handleCloseBookingModal} />
      )}
    </div>
  )
}

export default DoctorsClientPage
