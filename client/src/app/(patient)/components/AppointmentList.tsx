"use client";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import RescheduleModal from "../components/RescheduleModal";
import { useState } from "react";
import { API_BASE_URL } from "@/constants/constants";
import { useRouter } from "next/navigation";
import { PiChatCircleDuotone } from "react-icons/pi";
interface Appointment {
  id: string;
  doctor: {
    id: string;
    name: string;
    specialty?: string;
    image: string;
  };
  date: string;
  status: string;
  type?: string;
  notes?: string;
}

export default function AppointmentList({
  appointments,
  refetch,
}: {
  appointments: Appointment[];
  refetch: () => void;
}) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
        ); // Adjusted size
      case "upcoming":
        return (
          <FaExclamationCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
        ); // Adjusted size
      case "cancelled":
        return <FaTimesCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />; // Adjusted size
      default:
        return <FaClock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />; // Adjusted size
    }
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "upcoming":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [showModal, setShowModal] = useState(false);
  const openModal = (id: string) => {
    setSelectedAppointmentId(id);
    setShowModal(true);
  };
  const closeModal = () => {
    setSelectedAppointmentId(null);
    setShowModal(false);
  };
  const handleCancel = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/cancel/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to cancel appointment");
        return;
      }
      toast.success("Appointment cancelled");
      refetch();
    } catch (error) {
      toast.error("Something went wrong" + error);
    }
  };
  const router = useRouter();
  const handleChatClick = (doctorId: string) => {
    router.push(`/dashboard/chat/${doctorId}`);
  };
  return (
    <div className="space-y-3 sm:space-y-4">
      {appointments.map((appointment) => {
        const dateObj = new Date(appointment.date);
        const date = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const time = dateObj.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const isUpcoming = dateObj > new Date();
        return (
          <div
            key={appointment.id}
            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
              isUpcoming ? "border-l-4 border-l-blue-500" : "border-gray-200"
            }`}
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-2 sm:mr-3">
                      <FaUserMd className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {appointment.doctor.name.toLowerCase().startsWith("dr")
                          ? appointment.doctor.name
                          : `Dr. ${appointment.doctor.name}`}
                      </h3>
                      {appointment.doctor.specialty && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          {appointment.doctor.specialty}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 md:space-x-6">
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <FaClock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      <span>{time}</span>
                    </div>
                  </div>
                  {appointment.type && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {appointment.type}
                      </span>
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="mt-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-700">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-6 flex flex-col items-start sm:items-end">
                  <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getStatusIcon(appointment.status)}
                    <span className="ml-1.5 sm:ml-2 capitalize">
                      {appointment.status}
                    </span>
                  </div>
                  {isUpcoming &&
                    appointment.status.toLowerCase() === "upcoming" && (
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => openModal(appointment.id)}
                          >
                            Reschedule
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
                            onClick={() => handleCancel(appointment.id)}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-xs text-gray-500">
                              Need to discuss something?
                            </span>
                            <button
                              className="text-xs sm:text-sm px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-md font-medium hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 transition-all duration-200 flex items-center gap-1.5"
                              onClick={() =>
                                handleChatClick(appointment.doctor.id)
                              }
                            >
                              <PiChatCircleDuotone className="w-4 h-4" />
                              Start Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {showModal && selectedAppointmentId && (
        <RescheduleModal
          appointmentId={selectedAppointmentId}
          onClose={closeModal}
          refetch={refetch}
        />
      )}
    </div>
  );
}
