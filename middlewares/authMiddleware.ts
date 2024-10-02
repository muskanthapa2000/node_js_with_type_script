import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/userModel";

// Extending Express Request to include the user object
interface AuthenticatedRequest extends Request {
    user?: { id: number; role?: string }; // Extend the user object to include role if needed
}

const authentication = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Login first" });
        return
    }

    jwt.verify(token, 'shhhhh', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            const { userID } = decoded as JwtPayload; // Ensure decoded has userID
            req.user = { id: userID };
            next(); // Call next to proceed
        }
    });
};

const authorisation = (permittedRoles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const userID = req.user.id;
        const user = await userModel.findByPk(userID);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const user_role = user.role; // Ensure the user model has a role property
        if (permittedRoles.includes(user_role)) {
            next(); // Call next to proceed
        } else {
            res.status(403).json({ message: "Not authorized" });
        }
    };
};

export { authentication, authorisation };
