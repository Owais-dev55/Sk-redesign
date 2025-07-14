"use client"

import type React from "react"
import { FaSearch } from "react-icons/fa"

interface Doctor {
  id: string
  name: string
  speciality: string
  image: string
}

interface FilterProps {
  doctors: Doctor[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedSpecialty: string
  setSelectedSpecialty: (specialty: string) => void
}

const Filter: React.FC<FilterProps> = ({
  doctors,
  searchTerm,
  setSearchTerm,
  selectedSpecialty,
  setSelectedSpecialty,
}) => {
  const specialties = Array.from(new Set(doctors.map((doctor) => doctor.speciality)))

  return (
    <section className="py-12 px-4 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none min-w-[200px] bg-white"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Filter
