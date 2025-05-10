import { getAuth, clerkClient } from "@clerk/express";

const authmiddleware = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user ID found" });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Optional: Attach user to request so other routes can access it
    req.user = user;

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authmiddleware;