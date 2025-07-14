"use client"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { FaUser, FaSpinner, FaEdit } from "react-icons/fa"
import { setUser } from "@/redux/slices/userSlice"
import { useDispatch } from "react-redux"
import ChangePassword from "../../components/ChangePassword" 
import Image from "next/image"
import { API_BASE_URL } from "@/constants/constants"

interface UserProfile {
  _id: string
  name: string
  email: string
  role: "ADMIN" | "PATIENT" | "DOCTOR"
  image: string | undefined
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: "", email: "" })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        const data = await res.json()
        if (res.ok) {
          setProfile(data.details)
          setProfileForm({
            name: data.details.name,
            email: data.details.email,
          })
        } else {
          toast.error(data.message || "Failed to load profile")
        }
      } catch  {
        toast.error("Error fetching profile" )
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true)
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileForm),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message || "Failed to update profile")
      const updatedUser: UserProfile = {
        ...profile!,
        ...profileForm,
        _id: profile!._id,
        role: profile!.role,
        image: profile!.image,
      }
      setProfile(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      dispatch(setUser(updatedUser))
      toast.success("Profile updated successfully")
    } catch {
      toast.error("Something went wrong while updating profile")
    } finally {
      setUpdating(false)
    }
  }

  const updateImage = async () => {
    if (!imageFile) return
    setUploading(true)
    const formData = new FormData()
    formData.append("image", imageFile)
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })
      const data = await res.json()
      console.log("Upload response:", data)
      if (!res.ok || !data.image) {
        toast.error(data.message || "Upload failed")
        return
      }
      const updatedUser: UserProfile = {
        ...profile!,
        image: data.image,
      }
      console.log("Updated image:", data.image)
      setProfile(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      dispatch(setUser(updatedUser))
      toast.success("Profile picture updated")
      setPreviewUrl(null)
    } catch (err) {
      console.error("Upload error", err)
      toast.error("Upload error")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <FaSpinner className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600 mt-3 sm:mt-4 text-center text-sm sm:text-base">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8">
      <div className="max-w-full sm:max-w-6xl mx-auto px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <FaUser className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your account settings and security</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <FaEdit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-gray-500 text-sm sm:text-base">Update your personal details</p>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0])
                      setPreviewUrl(URL.createObjectURL(e.target.files[0]))
                    }
                  }}
                  className="block w-full text-xs sm:text-sm text-gray-500 file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {previewUrl && (
                <div className="mt-3 sm:mt-4">
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow mx-auto sm:mx-0"
                    width={80}
                    height={80}
                  />
                  <button
                    onClick={() => updateImage()}
                    className="mt-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 text-sm sm:text-base"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Picture"}
                  </button>
                </div>
              )}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Account Role</label>
                <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl text-sm sm:text-base">
                  <span className="text-blue-800 font-semibold capitalize">{profile?.role}</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 sm:py-3 sm:px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                  onClick={handleUpdateProfile}
                  disabled={updating}
                >
                  {updating ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Updating Profile...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaEdit className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Update Profile
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
          <ChangePassword />
        </div>
      </div>
    </div>
  )
}
