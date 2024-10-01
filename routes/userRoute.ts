import { Router, Request, Response } from 'express';
import User from '../models/userModel';  // Assuming User model is already converted to TypeScript

const UserRoutes = Router();

// Route to fetch all users
UserRoutes.get('/users', async (req: Request, res: Response) => {
    try {
        // res.send("user fetched successfully")
        const users = await User.findAll(); // Use Sequelize to fetch all users
        res.status(200).json(users); // Return users as JSON response
    } catch (err) {
        console.error("Error fetching users", (err as Error).message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default UserRoutes;
