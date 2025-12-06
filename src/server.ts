import express, { Request, Response } from "express";
import morgan from "morgan";
import { initializeDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";


const app = express();
const PORT = 3000;

// use middleware
app.use(express.json());
app.use(morgan("dev"));

// Initialize database
initializeDB()
  .then(() => console.log("Database initialized"))
  .catch((err:any) => console.error("Error initializing database:", err));

// Import and use routes
app.use("/api" , authRoutes);


// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World! Next Level Developer!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});