"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/constants";
import { toast } from "react-toastify";
import CustomLoader from "@/components/Loader/CustomLoader";
import Modal from "./Modal";
import Image from "next/image";
interface Patient {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  createdAt: string;
  _count: {
    patientAppointments: number;
  };
}

export default function AdminpatientsPage() {
  const [patients, setpatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedpatientId, setSelectedpatientId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      setLoading(false);
      return;
    }

    const fetchpatients = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/patients`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to fetch patients");
          return;
        }

        setpatients(data.patients || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
        toast.error("Something went wrong while fetching patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchpatients();
  }, []);

  const handleDelete = async (patientId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/doctors/${patientId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete patient");
        return;
      }

      toast.success("Patient deleted successfully");
      setpatients((prev) => prev.filter((doc) => doc.id !== patientId));
    } catch (err) {
      console.error("Error deleting patient:", err);
      toast.error("Something went wrong while deleting the patient.");
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-bold leading-none tracking-tight">
            All Patients
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <CustomLoader />
          </div>
        ) : (
          <div className="p-4 pt-0">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Image</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-center">Appointments</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        No patients found.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr key={patient.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <Image
                            src={patient.image || "/icon-7797704_1280.png"}
                            alt={patient.name}
                            className="h-10 w-10 rounded-full object-cover"
                            width={40}
                            height={40}
                          />
                        </td>
                        <td className="px-4 py-2 font-medium">{patient.name}</td>
                        <td className="px-4 py-2">{patient.email}</td>
                        <td className="px-4 py-2">{patient.role}</td>
                        <td className="px-4 py-2">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => setSelectedpatientId(patient.id)}
                            className="text-blue-600 hover:underline"
                          >
                            View ({patient._count.patientAppointments})
                          </button>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-4">
              {patients.length === 0 ? (
                <p className="text-center text-gray-500">No patients found.</p>
              ) : (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src={patient.image || "/icon-7797704_1280.png"}
                        alt={patient.name}
                        className="h-12 w-12 rounded-full object-cover"
                        width={48}
                        height={48}
                      />
                      <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email}</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      <strong>Role:</strong> {patient.role}
                    </p>
                    <p className="text-sm">
                      <strong>Created:</strong>{" "}
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong>Appointments:</strong>{" "}
                      <button
                        onClick={() => setSelectedpatientId(patient.id)}
                        className="text-blue-600 underline"
                      >
                        View ({patient._count.patientAppointments})
                      </button>
                    </p>
                    <div className="mt-2">
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="text-red-600 underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedpatientId && (
        <Modal
          patientId={selectedpatientId}
          onClose={() => setSelectedpatientId(null)}
        />
      )}
    </div>
  );
}
