import jwt from "jsonwebtoken";

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: "Access denied, token missing!" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JSON_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export { authenticateJWT };
