import { Suspense } from "react"
import DoctorsClientPage from "./DoctorsClientPage"

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-600 text-lg">Loading doctors...</div>}>
      <DoctorsClientPage />
    </Suspense>
  )
}
