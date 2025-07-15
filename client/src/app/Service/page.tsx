"use client";
import Link from "next/link";
import {
  FaStethoscope,
  FaChild,
  FaHeartbeat,
  FaFlask,
  FaTooth,
  FaUserMd,
} from "react-icons/fa";

const services = [
  {
    title: "General Checkup",
    description:
      "Routine exams, health screenings, and personalized care plans.",
    icon: FaStethoscope,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Pediatrics",
    description: "Expert care for infants, children, and adolescents.",
    icon: FaChild,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Cardiology",
    description: "Comprehensive heart care by specialized cardiologists.",
    icon: FaHeartbeat,
    color: "bg-red-100 text-red-600",
  },
  {
    title: "Lab Testing",
    description: "Reliable diagnostic lab services and reports.",
    icon: FaFlask,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Dentistry",
    description: "Quality dental checkups and treatments.",
    icon: FaTooth,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Online Consultations",
    description: "Book secure video sessions with doctors anytime.",
    icon: FaUserMd,
    color: "bg-teal-100 text-teal-600",
  },
];

const Services = () => {
  return (
    <section className="bg-gray-50 py-20" id="services">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14 space-y-4">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Quality Care, Tailored to You
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From routine checkups to specialist consultations, we connect you
            with trusted medical professionals.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 group hover:shadow-lg transition-transform hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 ${service.color}`}
              >
                <service.icon className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {service.title}
              </h3>

              <p className="text-sm text-slate-600">{service.description}</p>
              <Link href={`/Doctors?speciality=${service.title}`}>
                <button className="mt-4 inline-block text-blue-600 hover:underline font-medium text-sm cursor-pointer">
                  Book Now →
                </button>
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Not sure which service you need?
          </h3>
          <p className="text-slate-600 mb-6">
            Let us guide you to the right healthcare professional.
          </p>
          <Link
            href="/Doctors"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Browse Doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
