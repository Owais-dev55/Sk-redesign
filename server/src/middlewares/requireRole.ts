import { Request, Response, NextFunction } from "express";

interface RoleProtectedRequest extends Request {
  user?: {
    id: string;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
  };
}

export const requireRole = (role: "ADMIN" | "DOCTOR" | "PATIENT") => {
  return (req: RoleProtectedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ message: `Access denied: ${role} role required.` });
    }
    next();
  };
};
