import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.headers("Authorization").replace("Bearer ","");
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "token is invalid" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
}

export default protectedRoute;