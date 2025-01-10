import { NextFunction,Request,Response } from "express";
import {auth} from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      auth0Id?: string;
      userId: string;
    }
  }
}

export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSER_BASE_URL,
    tokenSigningAlg: 'RS256'
  });

  export const jwtParse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;
  
    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No valid Bearer token provided" });
      return; // Ensure the function doesn't proceed further
    }
  
    const token = authorization.split(" ")[1];
  
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload | null;
  
      if (!decoded || !decoded.sub) {
        res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        return;
      }
  
      const auth0Id = decoded.sub;
  
      const user = await User.findOne({ auth0Id });
      if (!user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
      }
  
      req.auth0Id = auth0Id;
      req.userId = user._id.toString();
  
      next(); // Pass control to the next middleware
    } catch (error) {
      console.error("Error parsing JWT:", error);
      res.status(401).json({ message: "Unauthorized: Token verification failed" });
    }
  };
  