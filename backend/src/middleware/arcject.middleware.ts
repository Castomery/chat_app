import aj from "../configs/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import type { Request, Response } from "express";

const arcjectProtection = async (req: Request, res: Response, next: Function) => {

    try {

        const decision = await aj.protect(req as any);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Rate limit exceeded." })
            }
            else if (decision.reason.isBot()) {
                return res.status(429).json({ message: "Bot access denied." })
            } else {
                return res.status(403).json({ message: "Access denied by security policy" })
            }
        }

        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error: "Spoofed bot detected",
                message:"Malicious bot activity detected",
            })
        }

        next();

    } catch (error) {
        console.log(error);
        next();
    }

}

export default arcjectProtection;
