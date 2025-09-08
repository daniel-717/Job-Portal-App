import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { connectDB } from './lib/db.js';

import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(xss());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors({
  origin: ["http://localhost:5173", "https://job-portal-app-five-alpha.vercel.app"],
  credentials: true
}));

app.use('/api/auth', userRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

export default app;