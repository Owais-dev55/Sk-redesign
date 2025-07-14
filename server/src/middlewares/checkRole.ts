import { Request, Response, NextFunction } from "express";

interface RoleProtectedRequest extends Request {
  user?: {
    id: string;
    role: "ADMIN" | "DOCTOR" | "PATIENT";
  };
}

export const checkRole = (roles: ("ADMIN" | "DOCTOR" | "PATIENT")[]) => {
  return (req: RoleProtectedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: requires one of [${roles.join(", ")}] roles.`,
      });
    }
    next();
  };
};
