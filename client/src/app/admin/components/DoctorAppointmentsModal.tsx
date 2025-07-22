"use client";

import type React from "react";

import { API_BASE_URL } from "@/constants/constants";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaSave, FaBan, FaRedo } from "react-icons/fa";
import CustomLoader from "@/components/Loader/CustomLoader";

interface Appointment {
  id: string;
  date: string;
  time: string;
  patient: {
    name: string;
  };
  status: string;
}

interface DoctorAppointmentsModalProps {
  doctorId: string;
  onClose: () => void;
}

const DoctorAppointmentsModal: React.FC<DoctorAppointmentsModalProps> = ({
  doctorId,
  onClose,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/api/admin/appointments?doctorId=${doctorId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch appointments");
          return;
        }
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Something went wrong while fetching appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [doctorId]);

  const handleCancel = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/admin/doctors/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to cancel appointment");
        return;
      }

      toast.success("Appointment cancelled successfully!");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Something went wrong while cancelling the appointment.");
    }
  };

  const handleReschedule = async (appointmentId: string) => {
    if (!newDate || !newTime) {
      toast.error("Please provide both date and time for rescheduling.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/admin/doctors/${appointmentId}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            newDate,
            newTime,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to reschedule appointment");
        return;
      }

      toast.success("Appointment rescheduled successfully!");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? { ...appt, status: "upcoming", date: newDate, time: newTime }
            : appt
        )
      );
      setRescheduleId(null);
      setNewDate("");
      setNewTime("");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Something went wrong while rescheduling the appointment.");
    }
  };

  console.log(appointments);

    if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-3 sm:px-6 md:px-8">
      <div className="bg-white/90 backdrop-blur-md p-5 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
            Doctor&apos;s Appointments
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            No appointments found for this doctor.
          </p>
        ) : (
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-gray-700">
                  <p>
                    <strong className="font-medium">Patient:</strong>{" "}
                    {appt.patient.name}
                  </p>
                  <p>
                    <strong className="font-medium">Date:</strong>{" "}
                    {new Date(appt.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className="font-medium">Time:</strong>{" "}
                    {appt.date.toString().slice(11, 16)}
                  </p>
                  <p>
                    <strong className="font-medium">Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        appt.status === "cancelled"
                          ? "text-red-600"
                          : appt.status === "rescheduled"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                  </p>
                </div>

                {rescheduleId === appt.id ? (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Reschedule Appointment
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                        aria-label="New date"
                      />
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                        aria-label="New time"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <button
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        onClick={() => handleReschedule(appt.id)}
                      >
                        <FaSave className="mr-2" /> Save
                      </button>
                      <button
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
                        onClick={() => setRescheduleId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  appt.status !== "cancelled" && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row flex-wrap gap-3">
                      <button
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        onClick={() => handleCancel(appt.id)}
                      >
                        <FaBan className="mr-2" /> Cancel
                      </button>
                      <button
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                        onClick={() => setRescheduleId(appt.id)}
                      >
                        <FaRedo className="mr-2" /> Reschedule
                      </button>
                    </div>
                  )
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsModal;
