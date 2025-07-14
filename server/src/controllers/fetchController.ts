import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import cloudinary from "../../utils/cloudinary";

export const getuserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const details = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!details) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({ details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const updateuserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, email, speciality } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const dataToUpdate: any = { name, email };
    if (user.role === "DOCTOR" && speciality) {
      dataToUpdate.speciality = speciality;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    res.json({ message: "Profile updated successfully", profile: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const fileBuffer = req.file?.buffer;
    const fileType = req.file?.mimetype;

    if (!fileBuffer || !fileType) {
      res.status(400).json({ message: "No image uploaded" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      `data:${fileType};base64,${fileBuffer.toString("base64")}`,
      { folder: "user-profiles" }
    );

    const imageUrl = cloudinaryResponse.secure_url;

    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    return res.json({ message: "Image uploaded", image: imageUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

export const specality = async (req: Request, res: Response) => {
  try {
    const specalities = [
      { id: 1, name: "Cardiology" },
      { id: 2, name: "Dermatology" },
      { id: 3, name: "Endocrinology" },
      { id: 4, name: "Gastroenterology" },
      { id: 5, name: "Nephrology" },
      { id: 6, name: "Neurology" },
      { id: 7, name: "Oncology" },
      { id: 8, name: "Ophthalmology" },
      { id: 9, name: "Orthopedics" },
      { id: 10, name: "Pediatrics" },
      { id: 11, name: "Psychiatry" },
      { id: 12, name: "Pulmonology" },
      { id: 13, name: "Rheumatology" },
      { id: 14, name: "Urology" },
      { id: 15, name: "Gynecology" },
      { id: 16, name: "General Surgery" },
      { id: 17, name: "ENT (Otolaryngology)" },
      { id: 18, name: "Hematology" },
      { id: 19, name: "Allergy & Immunology" },
      { id: 20, name: "Family Medicine" },
    ];

    res.status(200).json({ specality: specalities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchDoctors = async (req:Request , res:Response) => {
  try {
     const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: { id: true, name: true, role:true , speciality:true , image:true }, 
    }) 
   res.status(200).json({ doctors });

  }catch(err){
     console.error("Error fetching doctors:", err)
     res.json(
      { message: "Failed to fetch doctors" },
      { status: 500 }
    )
  }
}