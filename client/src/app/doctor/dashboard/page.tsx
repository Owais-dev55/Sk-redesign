'use client';

import { useEffect, useState } from 'react';
import {
  FaUser,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomLoader from '@/components/Loader/CustomLoader';

interface User {
  name: string;
  email: string;
  role: string;
}

export default function DoctorDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        router.replace("/login");
        return;
      }

      try {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.role !== "DOCTOR") {
          router.replace("/");
          return;
        }

        setUser(parsedUser);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Invalid user in localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

 if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CustomLoader />
      </div>
    )
  }

  if (!isAuthorized || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaUser className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 capitalize">
            Welcome {user.name.split("  ")}!
          </h1>
          <p className="text-gray-600">Manage your appointments and profile</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/doctor/appointment"
            className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition">
                <FaCalendarAlt className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                My Appointments
              </h2>
            </div>
            <p className="text-gray-600">View upcoming, completed, or rejected appointments.</p>
          </Link>

          <Link
            href="/doctor/profile"
            className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-200 transition">
                <FaUser className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600">
                My Profile
              </h2>
            </div>
            <p className="text-gray-600">Update your personal details and profile photo.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
