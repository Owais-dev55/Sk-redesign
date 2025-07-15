"use client";
import { FaCalendarAlt, FaCheckCircle, FaUserMd } from "react-icons/fa";
interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialty?: string;
  };
  date: string;
  status: string;
  type?: string;
  notes?: string;
}
export default function AppointmentStats({
  appointments,
  upcomingCount,
}: {
  appointments: Appointment[];
  upcomingCount: number;
}) {
  const uniqueDoctors = new Set(appointments.map((apt) => apt.doctor.name))
    .size;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
            <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600 ">
              Total Appointments
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {appointments.length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
            <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Upcoming
            </p>

            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {upcomingCount}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
            <FaUserMd className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              Doctors
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {uniqueDoctors}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
