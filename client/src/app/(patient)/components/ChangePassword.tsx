"use client";
import { API_BASE_URL } from "@/constants/constants";
import { useState } from "react";
import { FaLock, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setChangingPassword(true);
      const res = await fetch(`${API_BASE_URL}/api/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to update password");
        return;
      }
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Something went wrong while changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
          <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Security Settings
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Update your password
          </p>
        </div>
      </div>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>
        <div className="pt-2">
          <button
            onClick={handlePasswordChange}
            disabled={changingPassword}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            {changingPassword ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Changing Password...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaLock className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Change Password
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
