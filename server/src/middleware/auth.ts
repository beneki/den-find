import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).send("Access denied");
    }

    try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(400).send("Invalid token");
    }
};
