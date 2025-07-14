"use client";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import RescheduleModal from "./ResheduleModal";
import { useState } from "react";
import { API_BASE_URL } from "@/constants/constants";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  type?: string;
  notes?: string;
  patient: {
    name: string;
    email: string;
  };
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
    case "upcoming":
      return (
        <FaExclamationCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
      );
    case "cancelled":
      return <FaTimesCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
    default:
      return <FaClock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
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

export default function AppointmentList({
  appointments,
  refetch,
}: {
  appointments: Appointment[];
  refetch: () => void;
}) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
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
      const res = await fetch(
        `${API_BASE_URL}/api/appointments/doctor/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

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

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/appointments/doctor/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "approved" }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to approve appointment");
        return;
      }
      toast.success("Appointment approved");
      refetch();
    } catch (error) {
      toast.error("Something went wrong" + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4">
      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-4">
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
                  isUpcoming
                    ? "border-l-4 border-l-blue-500 p-4 sm:p-6"
                    : "border-gray-200 p-4"
                }`}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    Patient: {appointment.patient?.name || "Unknown"}
                  </p>
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
                    ["upcoming", "reschedule"].includes(
                      appointment.status.toLowerCase()
                    ) && (
                      <div className="mt-2 flex space-x-2">
                        {appointment.status.toLowerCase() === "upcoming" && (
                          <>
                            <button
                              className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer"
                              onClick={() => handleApprove(appointment.id)}
                            >
                              Approve
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                              onClick={() => openModal(appointment.id)}
                            >
                              Reschedule
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
                              onClick={() => handleCancel(appointment.id)}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
