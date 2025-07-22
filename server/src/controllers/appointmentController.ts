import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
  };
}

const prisma = new PrismaClient();

function formatTo12Hour(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = ((hour + 11) % 12) + 1; 
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, date } = req.body;
    const patientId = req.user?.id;

    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ message: "Doctor ID and Date are required" });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const hours = appointmentDate.getHours();
    const minutes = appointmentDate.getMinutes();

    const availability = await prisma.schedule.findFirst({
      where: {
        doctorId,
        day: dayOfWeek,
      },
    });

    if (!availability) {
      return res
        .status(400)
        .json({ message: "Doctor is not available on this day." });
    }

    const [startHour, startMinute] = availability.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = availability.endTime.split(":").map(Number);

    const requestedTime = hours * 60 + minutes;
    const availableStart = startHour * 60 + startMinute;
    const availableEnd = endHour * 60 + endMinute;

    if (requestedTime < availableStart || requestedTime >= availableEnd) {
      return res.status(400).json({
        message: `Appointment must be between ${formatTo12Hour(
          availability.startTime
        )} and ${formatTo12Hour(availability.endTime)}.`,
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: appointmentDate,
      },
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Create Appointment Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const bookAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, datetime } = req.body;
    const patientId = (req as any).user?.id;

    if (!doctorId || !datetime) {
      return res
        .status(400)
        .json({ message: "Doctor ID and datetime are required." });
    }

    const combinedDateTime = new Date(datetime);

    if (isNaN(combinedDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid datetime format." });
    }

    const hours = combinedDateTime.getHours();
    const minutes = combinedDateTime.getMinutes();
    if (hours < 9 || (hours >= 17 && minutes > 0)) {
      return res.status(400).json({
        message: "Appointments allowed only between 09:00 A.M and 5:00 P.M",
      });
    }

    const doctor = await prisma.user.findUnique({ where: { id: doctorId } });
    if (!doctor || doctor.role !== "DOCTOR") {
      return res
        .status(404)
        .json({ message: "Doctor not found or invalid role." });
    }

    const dayOfWeek = combinedDateTime.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const availability = await prisma.schedule.findFirst({
      where: { doctorId, day: dayOfWeek },
    });

    if (!availability) {
      return res
        .status(400)
        .json({ message: "Doctor is not available on this day." });
    }

    const [startHour, startMinute] = availability.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = availability.endTime.split(":").map(Number);
    const requestedTime = hours * 60 + minutes;
    const availableStart = startHour * 60 + startMinute;
    const availableEnd = endHour * 60 + endMinute;

    if (requestedTime < availableStart || requestedTime >= availableEnd) {
      return res
        .status(400)
        .json({
          message: `Doctor is only available between ${availability.startTime} and ${availability.endTime}.`,
        });
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        date: combinedDateTime,
      },
    });

    return res.status(201).json({
      message: "Appointment booked successfully!",
      appointment,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getMyAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const patientId = req.user?.id;

    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDrAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const doctorId = req.user?.id;

    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAppointmentsByPatientId = async (
  req: Request,
  res: Response
) => {
  try {
    const { patientId } = req.params;
    console.log("Requested Patient ID:", patientId);

    const appointments = await prisma.appointment.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.params.appointmentId;
    const patientId = (req as any).user.id;
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.patientId !== patientId) {
      return res.status(403).json({ message: "Unauthorized or not found." });
    }

    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      return res
        .status(400)
        .json({ message: `Cannot cancel a ${appointment.status} appointment` });
    }

    const cancelled = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "cancelled" },
    });
    res.status(200).json({ message: "Appointment cancelled.", cancelled });
  } catch (err) {
    console.error("Cancel Appointment Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { newDate, newTime } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: Missing user" });
    }

    const patientId = req.user.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.patientId !== patientId) {
      return res.status(403).json({ message: "Unauthorized or not found." });
    }

    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      return res.status(400).json({
        message: `Cannot reschedule a ${appointment.status} appointment`,
      });
    }

    if (!newDate || !newTime) {
      return res
        .status(400)
        .json({ message: "New date and time are required" });
    }

    const [hours, minutes] = newTime.split(":").map(Number);
    const combinedDate = new Date(newDate);
    combinedDate.setHours(hours, minutes, 0, 0);

    if (isNaN(combinedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }

    if (hours < 9 || (hours >= 17 && minutes > 0)) {
      return res.status(400).json({
        message: "Appointments allowed only between 09:00 A.M and 5.00 P.M",
      });
    }

    const dayOfWeek = combinedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const availability = await prisma.schedule.findFirst({
      where: { doctorId: appointment.doctorId, day: dayOfWeek },
    });

    if (!availability) {
      return res
        .status(400)
        .json({ message: "Doctor is not available on this day." });
    }

    const [startHour, startMinute] = availability.startTime
      .split(":")
      .map(Number);
    const [endHour, endMinute] = availability.endTime.split(":").map(Number);
    const requestedTime = hours * 60 + minutes;
    const availableStart = startHour * 60 + startMinute;
    const availableEnd = endHour * 60 + endMinute;

    if (requestedTime < availableStart || requestedTime >= availableEnd) {
      return res.status(400).json({
        message: `Doctor is only available between  ${formatTo12Hour(availability.startTime)} and ${formatTo12Hour(availability.endTime)}.`,
      });
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: combinedDate,
        status: "upcoming",
      },
    });

    return res
      .status(200)
      .json({ message: "Appointment rescheduled", appointment: updated });
  } catch (err) {
    console.error("Error in rescheduleAppointment:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const drId = req.user?.id;
    const { appointmentId } = req.params;
    const { status, newDate, newTime } = req.body;

    const validStatuses = ["approved", "cancelled", "upcoming"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.doctorId !== drId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (["cancelled", "completed"].includes(appointment.status)) {
      return res
        .status(400)
        .json({ message: `Cannot update a ${appointment.status} appointment` });
    }

    const updateData: any = { status };

    if (status === "upcoming") {
      if (typeof newDate !== "string" || typeof newTime !== "string") {
        return res
          .status(400)
          .json({ message: "Reschedule requires new date and time" });
      }

      const combinedDateTime = new Date(`${newDate}T${newTime}`);
      if (isNaN(combinedDateTime.getTime())) {
        return res
          .status(400)
          .json({ message: "Invalid date or time format." });
      }

      const hours = combinedDateTime.getHours();
      const minutes = combinedDateTime.getMinutes();
      if (hours < 9 || (hours >= 17 && minutes > 0)) {
        return res.status(400).json({
          message: "Appointments allowed only between 09:00 A.M and 5:00 P.M",
        });
      }

      updateData.date = combinedDateTime;
    }

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
    });

    res
      .status(200)
      .json({ message: "Appointment updated", appointment: updated });
  } catch (err) {
    console.error("Update appointment status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
