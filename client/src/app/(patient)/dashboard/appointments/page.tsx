"use client";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import AppointmentStats from "../../components/AppointmentStats";
import AppointmentList from "../../components/AppointmentList";
import Link from "next/link";
import { API_BASE_URL } from "@/constants/constants";

interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialty?: string;
    image: string;
  };
  date: string;
  status: string;
  type?: string;
  notes?: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/appointments/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true;
    return appointment.status.toLowerCase() === filter;
  });

  const upcomingAppointments = appointments.filter(
    (apt) =>
      new Date(apt.date) > new Date() && apt.status.toLowerCase() === "approved"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FaSpinner className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">
                Loading your appointments...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-8">
        {appointments.length > 0 && (
          <AppointmentStats
            appointments={appointments}
            upcomingCount={upcomingAppointments.length}
          />
        )}
        {appointments.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="-mb-px flex space-x-4 sm:space-x-8">
                {["all", "approved", "pending", "cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize whitespace-nowrap transition-colors duration-200 ${
                      filter === status
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {status} (
                    {status === "all"
                      ? appointments.length
                      : appointments.filter(
                          (apt) => apt.status.toLowerCase() === status
                        ).length}
                    )
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-12 text-center border border-gray-200">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No appointments yet
            </h3>{" "}
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              You haven&apos;t booked any appointments. Start by scheduling your
              first appointment.
            </p>
            <Link
              href="/dashboard/book"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base" // Adjusted padding and text size
            >
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <AppointmentList
            appointments={filteredAppointments}
            refetch={fetchAppointments}
          />
        )}
        {filteredAppointments.length === 0 && appointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center border border-gray-200">
            <p className="text-gray-600 text-sm sm:text-base">
              No appointments found for the selected filter.
            </p>{" "}
          </div>
        )}
      </div>
    </div>
  );
}
