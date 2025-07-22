import express from 'express'
import cors from "cors";
import authRoutes from './routes/authRoutes';
import appointmentRoutes from './routes/appointmentRoutes'; 
import profileRoutes from './routes/profileRoutes'
import messageRoutes from "./routes/messageRoutes";
import adminRoutes from './routes/adminRoutes'
import scheduleRoutes from './routes/scheduleRoutes'

const app = express();

app.use(cors()); 
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api' , profileRoutes )
app.use("/api", messageRoutes);
app.use('/api/admin' ,adminRoutes)
app.use('/api/availability', scheduleRoutes);

export default app;
