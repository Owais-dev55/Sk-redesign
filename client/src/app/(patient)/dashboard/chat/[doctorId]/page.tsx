"use client";

import Chat from "@/app/doctor/components/Chat";
import CustomLoader from "@/components/Loader/CustomLoader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientChatPage() {
  const { doctorId } = useParams();
  const [patientId, setPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === "PATIENT") {
          setPatientId(parsed._id);
        }
      }
    } catch (err) {
      console.error("Failed to parse user data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CustomLoader />
      </div>
    )
  }
  if (!patientId)
    return (
      <p className="p-6 text-red-600">
        Patient ID not found. Please make sure you&apos;re logged in as a patient.
      </p>
    );

  return (
      <Chat currentUserId={patientId} receiverId={doctorId as string} />
  );
}
