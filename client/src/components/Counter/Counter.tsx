"use client"

import { useEffect, useState, useRef } from "react"

const Counter = () => {
  const details = [
    {
      title: "15K",
      description: "Happy Customers",
    },
    {
      title: "150K",
      description: "Monthly Visitors",
    },
    {
      title: "15",
      description: "Countries  Worldwide",
      width: "177px",
    },
    {
      title: "100+",
      description: "Top Partners",
    },
  ]

  const [counters, setCounters] = useState(details.map(() => 0))
  const statsRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const getNumericValue = (title: string) => {
    return Number.parseInt(title.replace(/[^0-9]/g, ""))
  }

  const getSuffix = (title: string) => {
    return title.replace(/[0-9]/g, "")
  }

  useEffect(() => {
    if (hasAnimated) return

    const startCounters = () => {
      const targetValues = details.map((detail) => getNumericValue(detail.title))

      const duration = 2000
      const steps = 50
      const stepTime = duration / steps

      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++

        if (currentStep <= steps) {
          const progress = currentStep / steps
          setCounters(targetValues.map((target) => Math.floor(target * progress)))
        } else {
          setCounters(targetValues)
          clearInterval(interval)
        }
      }, stepTime)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounters()
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      observer.disconnect()
    }
  })

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {details.map((detail, index) => (
            <div key={index} className="text-center flex flex-col items-center justify-center">
              <h1 className="font-bold text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-[58px] leading-tight tracking-[0.2px] text-[#1A1A1A] mb-2">
                {counters[index]}
                {getSuffix(detail.title)}
              </h1>
              <h5
                className="font-bold text-sm sm:text-base leading-6 tracking-[0.1px] text-[#4A4A4A]"
                style={{ maxWidth: detail.width }}
              >
                {detail.description}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Counter