"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants/constants";

export default function BookAppointmentModal({
  onClose,
  id,
}: {
  onClose: () => void;
  id: string;
}) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    setNewDate("");
    setNewTime("");
  }, [id]);

  const handleBook = async () => {
    if (!newDate || !newTime) {
      toast.error("Please select a date and time");
      return;
    }
    const combinedDateTime = new Date(`${newDate}T${newTime}:00`);
    if (isNaN(combinedDateTime.getTime())) {
      toast.error("Invalid date or time selected.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          doctorId: id,
          date: newDate,
          time: newTime,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to book");
        return;
      }

      toast.success("Appointment booked successfully");
      router.push("/dashboard/appointments");
      onClose(); 
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-3 sm:px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
          aria-label="Close modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Book Appointment
        </h2>
        <div className="grid gap-4 py-4">
          <div>
            <label
              htmlFor="newDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="newDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-colors"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="newTime"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Time
            </label>
            <div className="relative">
              <input
                type="time"
                id="newTime"
                value={newTime}
                min="09:00"
                max="17:00"
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-colors"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Available: 9:00 AM - 5:00 PM
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-gray-600 hover:underline text-sm sm:text-base mt-2 sm:mt-0"
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2 h-4 w-4" /> Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
