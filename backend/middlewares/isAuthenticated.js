import { clerkClient } from "@clerk/clerk-sdk-node";

const authenticateClerk = async (req, res, next) => {
  const sessionToken = req.headers.authorization?.split(" ")[1];

  if (!sessionToken) {
    return res
      .status(403)
      .json({ message: "Access denied, session token missing!" });
  }

  try {
    const session = await clerkClient.sessions.verifySession(sessionToken);
    req.userId = session.userId;
    req.role = session.role || "user"; // You can set default role here
    next();
  } catch (error) {
    console.error("Session verification failed:", error.message);
    return res.status(401).json({ message: "Invalid session" });
  }
};

export { authenticateClerk };
