"use client";

import Chat from "../../components/Chat";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DoctorChatPage() {
  const { patientId } = useParams();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === "DOCTOR") {
          setDoctorId(parsed._id); 
        }
      }
    } catch (err) {
      console.error("Failed to parse user data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading chat...</p>;

  if (!doctorId)
    return (
      <p className="p-6 text-red-600">
        Doctor ID not found. Please make sure you&apos;re logged in as a doctor.
      </p>
    );

  return (
      <Chat currentUserId={doctorId} receiverId={patientId as string} />
   );
}
