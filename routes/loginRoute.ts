import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const loginRouter = Router();

interface LoginRequestBody {
    mobile: string;
    password: string;
}

loginRouter.post("/login",  async (req: Request, res: Response): Promise<void> => {
    try {
        const { mobile, password } = req.body;

        // Find the user by mobile number
        const is_user = await User.findOne({ where: { mobile } });
        if (!is_user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Compare provided password with the stored hashed password
        const hashed_password = is_user.password;
        bcrypt.compare(password, hashed_password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Something went wrong during password comparison" });
            }

            if (!result) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            // Generate JWT token if password matches
            const token = jwt.sign({ userID: is_user.id }, 'shhhhh', { expiresIn: '30m' });
            res.status(200).json({ token });
        });

    } catch (error) {
        console.error("Error during login: ", error);
        res.status(500).json({ message: "Error during login", details: error instanceof Error ? error.message : "Unknown error" });
    }
});

export default loginRouter;
