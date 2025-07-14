import express from 'express'
import cors from "cors";
import authRoutes from './routes/authRoutes';
import appointmentRoutes from './routes/appointmentRoutes'; 
import profileRoutes from './routes/profileRoutes'

const app = express();
app.use(cors()); 
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api' , profileRoutes )

export default app;
