"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const checkRole_1 = require("../middlewares/checkRole");
const router = express_1.default.Router();
router.post("/register", authController_1.registerUser);
router.post("/login", authController_1.loginUser);
router.get("/me", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("PATIENT"), (req, res) => {
    res.json({ message: "Welcome!", user: req.user, });
});
router.get("/dashboard", authMiddleware_1.authMiddlewWare, (0, checkRole_1.checkRole)(["DOCTOR", "ADMIN"]), (req, res) => {
    var _a;
    res.send(`Welcome to the shared dashboard, ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.role}!`);
});
exports.default = router;
