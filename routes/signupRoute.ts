import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';  

const SignupRouter = Router();

// Route to fetch all users (GET /sign)
SignupRouter.get('/sign', async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Error while fetching users" });
    }
});

// Route to sign up a new user (POST /signup)
SignupRouter.post("/signup", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, mobile, role } = req.body;

        // Check if the required fields are provided
        if (!name || !email || !password || !mobile) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        // Hash the password using bcrypt with 6 salt rounds
        const hashedPassword = await bcrypt.hash(password, 6);

        // Once hashed, proceed to create the user
        const signedUp = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            role
        });

        res.status(201).json({ signedUp });
    } catch (error: any) {
        console.error("Error during signup: ", error);
        res.status(500).json({ error: "Error while creating account", details: error.message });
    }
});

export default SignupRouter;
