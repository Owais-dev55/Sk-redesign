import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAvailability = async (req: Request, res: Response) => {
  try {
    const { doctorId, day, startTime, endTime } = req.body;

    if (!doctorId || !day || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    if (startHour < 9 || endHour > 17 || startHour >= endHour) {
      return res.status(400).json({
        message:
          "Time must be between 09:00 A.M and 5:00 P.M.",
      });
    }

    if (startMin !== 0 || endMin !== 0) {
      return res.status(400).json({
        message:
          "Time must be on the hour (e.g., 09:00, 10:00). No partial minutes allowed.",
      });
    }

    const existing = await prisma.schedule.findFirst({
      where: { doctorId, day },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Schedule for this day already exists." });
    }
    const availability = await prisma.schedule.create({
      data: {
        day,
        startTime,
        endTime,
        doctor: {
          connect: { id: doctorId },
        },
      },
    });

    res.status(201).json(availability);
  } catch (error) {
    console.error("Error creating availability:", error);
    res.status(500).json({ message: "Server error creating availability." });
  }
};

export const getDoctorAvailability = async (req: Request, res: Response) => {
  const { doctorId } = req.params;

  try {
    const availability = await prisma.schedule.findMany({
      where: { doctorId },
      orderBy: { day: "asc" },
    });

    res.status(200).json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error fetching availability." });
  }
};

export const deleteAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await prisma.schedule.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ message: "Schedule deleted successfully.", deleted });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    res.status(500).json({ message: "Server error deleting schedule." });
  }
};

export const updateAvailability = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { day, startTime, endTime } = req.body;

  try {
    const updated = await prisma.schedule.update({
      where: { id },
      data: { startTime, endTime, day },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ message: "Server error updating schedule." });
  }
};
