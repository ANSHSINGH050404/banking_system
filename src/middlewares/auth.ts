import type { Response, Request } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: any) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decodedToken;

        return res.status(200).json({ message: "Authorized" ,user:decodedToken});
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
        
    }
}