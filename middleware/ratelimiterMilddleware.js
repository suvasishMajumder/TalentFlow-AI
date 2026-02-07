
import { rateLimit } from "express-rate-limit";
import { logger } from "../logger.js"; // ✅ ADD THIS LINE

const getClientIP = (req) => {
  // Try different methods to get the real IP
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] || // Behind proxy x-forwarded-for → a standard header added by proxies. It can contain multiple IPs (the first one is the real client). ?.split(',')[0] picks the first IP if multiple exist.
    req.headers["x-real-ip"] || // Alternative header //sometimes used by Nginx or other proxy setups.
    req.connection?.remoteAddress || // Direct connection //the direct TCP connection’s address.
    req.socket?.remoteAddress || // Socket connection //same as above, fallback.
    "unknown-ip" //a default if none of the above exist.
  );
};

export const rateLimiterMiddleware = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: {
    success: false,
    error: "Too many requests. Please try again after 1 minute.",
  },
  standardHeaders: true, //standardHeaders: true → adds official HTTP headers like: RateLimit-Limit, RateLimit-Remaining, and RateLimit-Reset
  legacyHeaders: false, //disables the old-style X-RateLimit-* headers.
  keyGenerator: (req) => {
    if (req.user?.id) {
      return `user-${req.user.id}`;
    }

    let ip = getClientIP(req);

    // Normalize IP addresses
    /*
127.0.0.1 is called the loopback address.
It means “this computer itself” — not a public IP.

# On your laptop, 127.0.0.1 means your laptop itself

# On my laptop, 127.0.0.1 means my laptop itself

# On a deployed server, 127.0.0.1 means that server itself
    */

    //Case 1: ::1

    /*This is the IPv6 way of saying “localhost”.
So the code turns it into:

ip = '127.0.0.1';
Now, both IPv4 and IPv6 localhost look the same.

*/

    if (ip === "::1") ip = "127.0.0.1";

    /*
    Case 2: ::ffff:127.0.0.1

This means “IPv4 address 127.0.0.1 wrapped in IPv6 notation”.

The prefix ::ffff: is just an IPv6 marker.
So .substring(7) removes that prefix, leaving only:

ip = '127.0.0.1';
    */

    if (ip.startsWith("::ffff:")) ip = ip.substring(7);

    console.log(`Rate limit key: ${ip}`);
    return ip;
  },
  handler: (req, res, next, options) => {
    const ip = getClientIP(req);

    // ✅ REPLACED console.log WITH PINO LOGGING
    logger.warn(  {
        event: "RATE_LIMIT_EXCEEDED",
        ip,
        method: req.method,
        route: req.originalUrl,
        userAgent: req.headers["user-agent"],
        
      },)



    console.warn(
      {
        event: "RATE_LIMIT_EXCEEDED",
        ip,
        method: req.method,
        route: req.originalUrl,
        userAgent: req.headers["user-agent"],
        
      },
      "Rate limit exceeded"
    );

    res.status(429).json(options.message);
  },
});
