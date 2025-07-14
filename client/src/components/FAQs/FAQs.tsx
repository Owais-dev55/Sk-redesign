"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQs = () => {
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);

  const handleToggleQuestion = (id: string) => {
    setOpenQuestionId((prev) => (prev === id ? null : id));
  };

  const questions = [
    {
      id: "1",
      question: "How do I book an appointment with a doctor?",
      answer:
        "Simply select your preferred doctor, choose a suitable date and time, and confirm your booking in just a few clicks. You'll receive a confirmation instantly.",
    },
    {
      id: "2",
      question: "Can I reschedule or cancel my appointment?",
      answer:
        "Yes, you can easily reschedule or cancel any appointment through your dashboard up to 24 hours before the scheduled time.",
    },
    {
      id: "3",
      question: "Is my health data secure?",
      answer:
        "Absolutely. We use end-to-end encryption and follow strict HIPAA-compliant standards to ensure your medical data remains private and protected.",
    },
    {
      id: "4",
      question: "Are online consultations available?",
      answer:
        "Yes, many of our doctors offer secure online video consultations so you can receive expert care from the comfort of your home.",
    },
    {
      id: "5",
      question: "Do I need an account to book an appointment?",
      answer:
        "Yes, having an account helps us maintain your medical history and allows you to manage appointments, prescriptions, and more efficiently.",
    },
  ];

  return (
    <section id="faqs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-2">
            FAQs
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Got Questions? We’ve Got You Covered
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Here are answers to the most common questions our users ask. Still
            unsure? Reach out and we’ll be happy to help.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-y-4">
          {questions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out border border-gray-100 hover:shadow-lg"
            >
              <button
                className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
                onClick={() => handleToggleQuestion(item.id)}
                aria-expanded={openQuestionId === item.id}
                aria-controls={`faq-answer-${item.id}`}
                id={`faq-question-${item.id}`}
                role="button"
              >
                <p className="font-semibold text-base sm:text-lg text-gray-800 pr-4">
                  {item.question}
                </p>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    openQuestionId === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${item.id}`}
                role="region"
                aria-labelledby={`faq-question-${item.id}`}
                className={`grid transition-all duration-300 ease-in-out ${
                  openQuestionId === item.id
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-gray-600 text-sm sm:text-base px-5 pb-5 pt-2">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
