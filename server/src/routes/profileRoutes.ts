import express from "express";
import { authMiddlewWare } from "../middlewares/authMiddleware";
import { getuserProfile, updateuserProfile , changePassword, uploadImage, fetchDoctors, specality,  getUserById  } from "../controllers/fetchController";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router()

router.get("/profile", authMiddlewWare,  getuserProfile);
router.put("/profile", authMiddlewWare, updateuserProfile);
router.put("/change-password", authMiddlewWare, changePassword);
router.post('/profile/upload' , authMiddlewWare , upload.single("image"),uploadImage )

router.get('/doctors', fetchDoctors)
router.get('/specality' , specality)
router.get('/user/:id' , getUserById)

export default router