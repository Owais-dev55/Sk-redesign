import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaComments,
  FaShieldAlt,
  FaStethoscope,
  FaUsers,
} from "react-icons/fa";

const features = [
  {
    icon: <FaCalendarAlt className="w-6 h-6 text-blue-600" />,
    title: "Easy Appointment Booking",
    description:
      "Schedule appointments with your preferred doctors in just a few clicks. Choose from available time slots that work for you.",
    bgColor: "bg-blue-100",
  },
  {
    icon: <FaComments className="w-6 h-6 text-teal-600" />,
    title: "Instant Consultations",
    description:
      "Get immediate medical advice through secure video calls or chat with certified healthcare professionals.",
    bgColor: "bg-teal-100",
  },
  {
    icon: <FaShieldAlt className="w-6 h-6 text-green-600" />,
    title: "Secure Health Records",
    description:
      "Your medical history, prescriptions, and test results are safely stored and easily accessible whenever you need them.",
    bgColor: "bg-green-100",
  },
  {
    icon: <FaClock className="w-6 h-6 text-orange-600" />,
    title: "24/7 Availability",
    description:
      "Access healthcare services round the clock. Emergency consultations and support are always available.",
    bgColor: "bg-orange-100",
  },
  {
    icon: <FaUsers className="w-6 h-6 text-purple-600" />,
    title: "Expert Specialists",
    description:
      "Connect with specialists across various medical fields, from cardiology to dermatology and beyond.",
    bgColor: "bg-purple-100",
  },
  {
    icon: <FaStethoscope className="w-6 h-6 text-blue-600" />,
    title: "Health Monitoring",
    description:
      "Track your health metrics, medication schedules, and receive personalized health insights and reminders.",
    bgColor: "bg-blue-100",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything You Need for Better Healthcare</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to manage your health effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
              >
                <div className="text-center space-y-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  );
};

export default Features;
