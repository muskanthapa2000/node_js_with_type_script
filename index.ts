import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import sequelize from './config/db';  // Assuming sequelize is already set up with TypeScript
import UserRoutes from './routes/userRoute';  // Assuming user routes are typed
import SignupRouter from './routes/signupRoute';
import loginRoute from './routes/loginRoute';


// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Use the user routes
app.use('/api', UserRoutes);
app.use('/api' , SignupRouter);
app.use('/api' , loginRoute)

// Root route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Get the port from environment variables or default to 8000
const port = process.env.PORT || 8080;

// Start the server and sync the database
app.listen(port, async () => {
    try {
        await sequelize.sync(); // Sync all models with the database
        console.log('Database synced');
        console.log(`Server is running on port ${port}`);
    } catch (err) {
        console.error('Error syncing the database:', err);
    }
});

