const jwt = require("jsonwebtoken");
const userModel = require("../models/auth.model");

const protect = async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
        try {
            token = authHeader.split(" ")[1]?.trim();
            token = token?.replace(/^['"]|['"]$/g, "");

            if (!token) {
                return res.status(401).json({
                    message: "Not authorized, token missing"
                });
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            req.user = await userModel
                .findById(decoded.id)
                .select("-password");

            if (!req.user) {
                return res.status(401).json({
                    message: "User not found"
                });
            }

            return next();

        } catch (error) {
            console.log("Auth Error:", error.message);

            return res.status(401).json({
                message: "Not authorized, token failed",
                error: error.message
            });
        }
    }

    return res.status(401).json({
        message: "Not authorized, no token"
    });
};

module.exports = { protect };