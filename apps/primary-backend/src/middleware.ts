import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"



export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;

    try {
        const payload = jwt.verify(token, "secret" as string) as { id: number };
        req.id = payload.id
        next();
    } catch (error) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}
