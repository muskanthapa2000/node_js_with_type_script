
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/userModel";

// Extending Express Request to include the user object
interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

const authentication = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Login first" });
    }

    jwt.verify(token, 'shhhhh', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        } else {
            const { userID } = decoded as JwtPayload;
            req.user = { id: userID };
            next();
        }
    });
};

const authorisation = (permittedRoles: string[]) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userID = req.user.id;
        const user = await userModel.findByPk(userID);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const user_role = user.role;
        if (permittedRoles.includes(user_role)) {
            next();
        } else {
            res.status(403).json({ message: "Not authorized" });
        }
    };
};

export { authentication, authorisation };
