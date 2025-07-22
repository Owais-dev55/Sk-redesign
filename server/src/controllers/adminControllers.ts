import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adminFetchDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: {
        id: true,
        name: true,
        role: true,
        speciality: true,
        image: true,
        createdAt: true,
        email: true,
        doctorAppointments: true,
        _count: true,
      },
    });
    res.status(200).json({ doctors });
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.json({ message: "Failed to fetch doctors" }, { status: 500 });
  }
};

export const adminDeleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await prisma.$transaction([
        prisma.message.deleteMany({
          where: {
            OR: [{ senderId: userId }, { receiverId: userId }],
          },
        }),
        prisma.appointment.deleteMany({
          where: {
            OR: [{ doctorId: userId }, { patientId: userId }],
          },
        }),
        prisma.user.delete({
          where: { id: userId },
        }),
      ]);

      return res
        .status(200)
        .json({ message: "User and related data deleted successfully" });
    } catch (transactionError: any) {
      console.error("Transaction error:", transactionError.message, transactionError.stack);
      return res.status(500).json({
        message: "Deletion failed during transaction",
        error: transactionError.message,
      });
    }
  } catch (error: any) {
    console.error("Error deleting user:", error.message, error.stack);
    return res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const getAppointmentsByRole = async (req: Request, res: Response) => {
  const { doctorId, patientId } = req.query;

  try {
    const where: any = {};

    if (doctorId) where.doctorId = doctorId as string;
    if (patientId) where.patientId = patientId as string;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { id: true, name: true, email: true },
        },
        doctor: {
          select: { id: true, name: true, email: true, speciality: true },
        },
      },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};


export const adminCancelAppointment = async (req: Request, res: Response) => {
  try {
  const { appointmentId } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
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
    console.error("Error fetching appointment:", err);
    return res.status(500).json({ message: "Failed to Delete appointment" });
  }
};

export const adminRescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { newDate, newTime } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({ message: "New date and time are required" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status === "cancelled" || appointment.status === "completed") {
      return res.status(400).json({
        message: `Cannot reschedule a ${appointment.status} appointment`,
      });
    }
    const [hours, minutes] = newTime.split(":").map(Number);
    if (hours < 9 || (hours >= 17 && minutes > 0)) {
      return res.status(400).json({
        message: "Appointments allowed only between 09:00 A.M and 5:00 P.M",
      });
    }
    const [year, month, day] = newDate.split("-").map(Number);
    const combinedDate = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(combinedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format." });
    }
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: combinedDate,
        status: "upcoming",
      },
    });

    return res.status(200).json({
      message: "Appointment rescheduled",
      appointment: updated,
    });
  } catch (err) {
    console.error("Error rescheduling appointment:", err);
    return res.status(500).json({ message: "Failed to reschedule appointment" });
  }
};

export const adminFetchPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.user.findMany({
      where: { role: "PATIENT" },
      select: {
        id: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
        email: true,
        _count: true,
        patientAppointments:true,
      },
    });
    res.status(200).json({ patients });
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.json({ message: "Failed to fetch patients" }, { status: 500 });
  }
};

export const getAdminDashboardStats = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const totalDoctors = await prisma.user.count({
      where: { role: "DOCTOR" }
    })
  const totalAppointments = await prisma.appointment.count()

    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
        }
      }
    })

    const activePatients = await prisma.user.count({
      where: {
        role: "PATIENT",
      }
    })

    return res.json({
      totalDoctors,
      totalAppointments,
      newUsers,
      activePatients
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
  }
