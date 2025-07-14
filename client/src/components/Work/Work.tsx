"use client"
import { FaUserPlus, FaUserMd, FaHeartbeat } from "react-icons/fa" // Importing specific icons
import { FaArrowRight, FaArrowDown } from "react-icons/fa"

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Sign up and complete your medical profile with basic health information and preferences.",
      color: "bg-blue-600",
      icon: FaUserPlus, // React Icon component
    },
    {
      step: "2",
      title: "Choose Your Doctor",
      description: "Browse through our network of certified doctors and select the one that best fits your needs.",
      color: "bg-teal-600",
      icon: FaUserMd, // React Icon component
    },
    {
      step: "3",
      title: "Get Treatment",
      description: "Attend your appointment, receive treatment, and access your records anytime through the app.",
      color: "bg-green-600",
      icon: FaHeartbeat, // React Icon component
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      {" "}
      {/* Changed background to a subtle gray */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-2">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Getting Help Has Never Been Easier</h2>
        </div>

        {/* Steps with connectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Step Card */}
              <div
                className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 w-full max-w-xs mx-auto bg-white transform group-hover:-translate-y-1`}
              >
                <div
                  className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-105`}
                >
                  <step.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </div>

              {/* Connectors */}
              {i < steps.length - 1 && (
                <>
                  {/* Horizontal connector for desktop */}
                  <div className="hidden md:flex absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 w-8 h-1 bg-gray-200 items-center justify-center">
                    <FaArrowRight className="text-gray-400 text-xl absolute -right-6" />
                  </div>
                  {/* Vertical connector for mobile */}
                  <div className="md:hidden flex flex-col items-center mt-6">
                    <div className="w-1 h-8 bg-gray-200"></div>
                    <FaArrowDown className="text-gray-400 text-xl mt-2" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
