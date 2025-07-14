"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
interface User {
  name: string;
  email: string;
  role: string;
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);

      if (parsedUser.role !== "PATIENT") {
        router.replace("/");
        return;
      }

      setUser(parsedUser);
    } catch (err) {
      console.error("Invalid user format:", err);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar /> 
      <div className="flex-1">
        
        {children}
      </div>
    </div>
  );
}
