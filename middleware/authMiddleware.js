// middleware/verifyToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();




export const verifyToken = (req, res, next) => {
  // cookie-parser must be used before this middleware
  const token = req.cookies?.authToken;



  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not set");
    return res.status(500).json({ message: "Server misconfigured" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.warn("verifyToken: jwt.verify failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};


//Explanation:

/*
Good question — nice, focused middleware. Here’s a simple, ~200-word explanation of what it does and how next() hands control along:

This function is an Express middleware that protects routes by verifying a JWT from the request. When a request arrives, 
the middleware reads the Authorization header (usually Bearer <token>). It extracts the token part after the space. 
If there’s no token, it immediately sends a 401 Unauthorized JSON response and stops — the request never proceeds further.

If a token exists, the middleware calls jwt.verify(token, process.env.JWT_SECRET, callback). jwt.verify checks the 
token’s signature and expiration using your secret. It runs asynchronously and invokes the callback with 
either an err (verification failed) or a user payload (verification succeeded). If verification fails, 
the middleware sends a 403 Forbidden response and stops.

If verification succeeds, the middleware sets req.user = user. This attaches the decoded token payload 
(for example { id, email, iat, exp }) to the request object so later code can read the authenticated user. 
Finally, it calls next() — this tells Express “I’m done here, let the next middleware or
 the route handler run.” If next() is called, the request continues down the chain; 
if a response was sent earlier (res.status(...).json(...)), the chain stops there.
*/
