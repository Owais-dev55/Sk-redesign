"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (roles) => {
    return (req, res, next) => {
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
exports.checkRole = checkRole;
