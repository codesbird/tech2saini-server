import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:5174/',
  'http://localhost:3000', // Common React dev port
  // Add other origins if needed
];

export const corsMiddleware = cors({
  origin: allowedOrigins,
  credentials: true,
});
