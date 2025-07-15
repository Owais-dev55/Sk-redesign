"use client"
import Image from "next/image"
import Link from "next/link"
import {
  FaCalendarAlt,
  FaComments,
} from "react-icons/fa"

export default function ClinicalHomepage() {

  return (
    <div className="min-h-screen bg-white">    
       <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                  Trusted Healthcare Platform
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Your Health, <span className="text-blue-600">Our Priority</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Book appointments with certified doctors, get instant consultations, and manage your health records
                  all in one secure platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href='/Doctors'> 
                <button className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer">
                  <FaCalendarAlt className="w-5 h-5 mr-2" />
                 Book Appointment 
                </button>
                </Link>
                <Link href='/Doctors'> 
                <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors cursor-pointer">
                  <FaComments className="w-5 h-5 mr-2" />
                 Consult Now
                </button>
                </Link>
              </div>
              </div>
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/Doctors.jpg"
                  alt="Healthcare professionals"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  width={600}
                  height={400}
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  )
}
