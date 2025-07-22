"use client";

import { API_BASE_URL } from "@/constants/constants";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {formatTo12Hour} from '@/constants/constants'
interface Schedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

const AvailabilityForm = () => {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === "DOCTOR") {
        setDoctorId(parsed._id);
      } else {
        toast.error("Unauthorized access.");
      }
    } else {
      toast.error("No user found.");
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
  try {
    if (!doctorId) return;
    const res = await fetch(`${API_BASE_URL}/api/availability/${doctorId}`);
    const data = await res.json();
    setSchedules(data);
  } catch (error) {
    console.error("Error fetching schedules", error);
  }
}, [doctorId]);

  useEffect(() => {
    if (doctorId) fetchSchedules();
  }, [doctorId , fetchSchedules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!day || !startTime || !endTime)
      return toast.error("All fields required");

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, day, startTime, endTime }),
      });
      

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error creating schedule");
      }

      toast.success("Availability added!");
      setDay("");
      setStartTime("");
      setEndTime("");
      fetchSchedules();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error creating schedule");
      } else {
        toast.error("Error creating schedule");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/availability/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error deleting schedule");
      }

      toast.success("Deleted successfully");
      fetchSchedules();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error creating schedule");
      } else {
        toast.error("Error creating schedule");
      }
    }
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-lg w-full">
      <h2 className="text-xl font-semibold mb-4">Set Your Availability</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Day</option>
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded"
          step="3600"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 rounded"
          step="3600"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Schedule</h3>
        {schedules.length === 0 ? (
          <p className="text-gray-500">No schedule set.</p>
        ) : (
          <table className="w-full mt-2 border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Day</th>
                <th className="p-2 border">Start Time</th>
                <th className="p-2 border">End Time</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id}>
                  <td className="p-2 border">{s.day}</td>
                  <td className="p-2 border">{formatTo12Hour(s.startTime)}</td>
                  <td className="p-2 border">{formatTo12Hour(s.endTime)}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AvailabilityForm;
