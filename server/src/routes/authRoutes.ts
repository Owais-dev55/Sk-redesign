import express, { Request, Response } from "express";
import { registerUser, loginUser  } from "../controllers/authController";
import { authMiddlewWare } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";
import { checkRole } from "../middlewares/checkRole";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
  };
}

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(  "/me",  authMiddlewWare,  requireRole("PATIENT"), (req: AuthenticatedRequest, res: Response) => {
    res.json({message: "Welcome!",user: req.user, });
  }
);

router.get( "/dashboard", authMiddlewWare, checkRole(["DOCTOR", "ADMIN"]), (req: AuthenticatedRequest, res: Response) => {
    res.send(`Welcome to the shared dashboard, ${req.user?.role}!`);
  }
);

export default router;
