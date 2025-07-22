'use client';

import { ReactNode, useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { useRouter } from 'next/navigation';
import CustomLoader from '@/components/Loader/CustomLoader';

interface Doctor {
  name: string;
  email: string;
  role: string;
}

export default function DoctorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<Doctor | null>(null);
    const router = useRouter();
  
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
  
      if (!storedUser) {
        router.replace("/login");
        return;
      }
  
      try {
        const parsedUser: Doctor = JSON.parse(storedUser);
  
        if (parsedUser.role !== "DOCTOR") {
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
         <div className="flex justify-center items-center h-screen">
           <CustomLoader />
         </div>
       )
     }
  return (
    <div className="min-h-screen flex bg-gray-100">
<Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
