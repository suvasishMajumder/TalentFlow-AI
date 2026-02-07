// import bcrypt from "bcrypt";
// import pool from "../db.js";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "../generated/prisma/index.js";
// const prisma = new PrismaClient();

// // authController.js (or wherever you keep these handlers)
// /**
//  * Create cookie options - remember = true => persistent cookie (30 days)
//  */
// function makeCookieOptions(remember) {

// /*
// httpOnly: true
// → The cookie cannot be accessed by JavaScript (document.cookie).
// → Only the browser and server can use it.
// ✅ This protects your JWT from XSS attacks.

// secure: process.env.NODE_ENV === "production"
// → In production, the cookie will only be sent over HTTPS (not HTTP).
// → In development (localhost), you can still use it over normal HTTP.

// sameSite: "lax"
// → Controls when cookies are sent in cross-site requests.
// → "lax" means cookies are sent normally, but not for some risky cases like cross-site POSTs.
// → If you want stricter CSRF protection, you can use "strict" (but that can break some workflows like clicking links).

// path: "/"
// → Cookie is valid for the whole site (/auth, /tasks, /profile etc.).
// → Browser will attach it on every request to your backend domain. 
// */

//   const opts = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
//     sameSite: "lax", // use "strict" if you want stricter CSRF protection
//     path: "/", //path:"/" means that the cookie will be attached to every request sent from the client side starting from the "/"
//   };
//   if (remember) {
//     // 30 days
//     opts.maxAge = 1000 * 60 * 60 * 24 * 30;
//   }
//   // if !remember, cookie is a session cookie (no maxAge) and will be cleared when tab/browser closed
//   return opts;
// }

// export async function signupUser(req, res, next) {
//   const { email, password, role="user", remember = false } = req.body;

//   try {
//     // 1) Check if email exists
//     // const existing = await pool.query(`SELECT id FROM users WHERE email=$1`, [
//     //   email,
//     // ]);

//     const existing = await prisma.users.findFirst({ select: { id: true }, where: { email } });

//     if (existing) {
//       return res.status(409).json({ detail: "Email already registered" });
//     }

//     // 2) Hash password (you can use async versions in production)
//     const salt = bcrypt.genSaltSync(10);
//     const hashedpassword = bcrypt.hashSync(password, salt);

//     // 3) Insert user
//     // const usersignup = await pool.query(
//     //   `INSERT INTO users(email, password_hash) VALUES($1, $2) RETURNING id, email`,
//     //   [email, hashedpassword]
//     // );

//     const usersignup = await prisma.users.create({
//       data: {
//         email: email,
//         password: hashedpassword,
//         role: role,
//       },
//       select: {
//         id: true,
//         email: true,
//         role: true,
//       },
//     });

//     // 4) Ensure secret exists
//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is not set");
//       return res.status(500).json({ detail: "Server misconfigured" });
//     }

//     // 5) Sign JWT
//     const token = jwt.sign(
//       { id: usersignup.id, email: usersignup.email, role: usersignup.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" } // choose expiry that fits your security model
//     );

//     // 6) Set HttpOnly cookie (browser will store it);

//     //Explanation:

    
//     res.cookie("authToken", token, makeCookieOptions(remember));
//     // Yes — this sets a Set-Cookie header on the HTTP response so the browser will store the cookie; it does not end the response or
//     // send the body by itself. That’s why you call res.status(...) / res.json(...) afterwards (or chain them): res.cookie
//     // adds the header, and res.status(...).json(...) actually sets the HTTP status and sends the response
//     // body — the final response includes both the body and the Set-Cookie header.

//     // res.cookie("authToken", token, makeCookieOptions(remember));

//     // 7) Return minimal user info (no token)
//     return res.status(201).json({
//       email: usersignup.email,
//       message: "Signup successful",
//     });
//   } catch (error) {
//     console.error(error);

//     /*
//     if (error.code === "23505") { // unique violation
// 23505 is a PostgreSQL SQLSTATE code meaning unique_violation — it’s raised when you try to insert or update a row
//  that would break a UNIQUE constraint (for example inserting an email that’s already in a UNIQUE column/index).
//   Checking this lets you return a friendly 409 Conflict instead of a generic 500;
//  you can also inspect error.constraint or use INSERT ... ON CONFLICT to handle duplicates more explicitly.
//     */
//     if (error.code === "23505") {
//       // unique violation
//       return res.status(409).json({ detail: "Email already registered" });
//     }
//     return res.status(500).json({ detail: "Internal server error" });
//   }
// }

// export async function loginUser(req, res, next) {
//   const { email, password, role,  remember = false } = req.body;
//   console.log(typeof email, typeof password);
//   console.log(email, password);
//   try {
//     // Defensive: coerce inputs and trim email to avoid accidental whitespace mismatches
//     const inEmail = email == null ? "" : String(email).trim();
//     const inPassword = password == null ? "" : String(password);

//     // Use case-insensitive lookup
//     const users = await pool.query(
//       `SELECT * FROM users WHERE lower(email)=lower($1)`,
//       [inEmail]
//     );
// console.log(user)
//     console.log('login attempt:', { email: inEmail, rowCount: users.rowCount });
// console.log(users.rows.length)
//     if (!users.rows.length) {
//       return res.status(401).json({ detail: "Invalid credentials" });
//     }
// console.log(users.rows)
//     const stored = users.rows[0].password;
//     console.log('stored password type/len:', typeof stored, stored ? stored.length : 0);

//     if (!stored) {
//       return res.status(500).json({ detail: "User record missing password" });
//     }

//     console.log(inPassword,stored)
//     const success = await bcrypt.compare(inPassword, stored);
//     console.log(success);
//     if (!success) {
//       return res.status(401).json({ detail: "Invalid credentials" });
//     }

//     if (!process.env.JWT_SECRET) {
//       console.error("JWT_SECRET is not set");
//       return res.status(500).json({ detail: "Server misconfigured" });
//     }

//     const token = jwt.sign(
//       { id: users.rows[0].id, email: users.rows[0].email , role:users.rows[0].role},
//       process.env.JWT_SECRET,
//       { expiresIn: "6h" } // shorter expiry for login
//     );

//     // Set cookie
//     res.cookie("authToken", token, makeCookieOptions(remember));

//     // Return minimal info only
//     return res.status(200).json({
//       email: users.rows[0].email,
//       message: "Login successful",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ detail: "Server error" });
//   }
// }

// /** Logout handler - clears the cookie */

// /*
// 1. “Cookie set for root path” — what does that mean?

// When we set a cookie, we tell the browser which URLs should include that cookie when making requests back to the server.

// If the cookie has path: "/", it means the cookie will be sent with every request to your domain, no matter which endpoint (/auth/signup, /tasks, /profile, etc.).

// If the cookie had path: "/auth", then the browser would only send it for requests under /auth/....

// So path is about which routes automatically attach the cookie when the browser sends requests — not about identifying the user itself.

// 2. “But it is used for identifying the unique user, right?”

// Exactly ✅.
// The value inside the cookie (authToken in your case) is a JWT that encodes the user’s ID/email.
// When the browser makes a request:

// The cookie gets automatically attached (if path and domain match).

// Your backend reads the authToken cookie.

// You verify the JWT.

// The decoded JWT tells you who the user is (unique user ID, email, etc.).

// So the cookie is just a storage + transport mechanism.
// The actual “identity” comes from what’s inside the cookie (the JWT token).

// 👉 Think of it like this:

// Cookie = envelope.

// JWT inside = ID card of the user.

// Path="/" = deciding where the envelope can be delivered.
// */
// export function logoutUser(req, res) {
//   res.clearCookie("authToken", { path: "/" });
//   return res.status(200).json({ message: "Logged out" });
// }

// /** Example verifyToken middleware that reads the cookie */
// export function verifyToken(req, res, next) {
//   try {
//     const token = req.cookies?.authToken;
//     if (!token) return res.status(401).json({ detail: "Unauthorized" });

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     // Attach user info to req for downstream handlers
//     req.user = payload;
//     next();
//   } catch (err) {
//     console.error("verifyToken error:", err);
//     return res.status(401).json({ detail: "Invalid or expired token" });
//   }
// }





// //This exmpires In flow:


// /*
// direct answers to your questions

// Yes, when you jwt.sign(..., { expiresIn: "7d" }), the token is valid for 7 days. If cookie persists across browser restarts, the token will be sent and accepted until it expires.

// Yes, for login you signed a 6-hour token — user will be allowed until that token expires. If the cookie survives restart (because remember=true) the browser will keep sending it, but the token will fail after 6 hours.

// Best practice: either keep cookie maxAge in sync with JWT expiresIn, or (better) use short-lived access tokens + long-lived refresh tokens for safe, smooth UX.


// Yes — even if the cookie persists, once the 6-hour JWT expires the user must log in again.
// */


//new code



import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create cookie options
 */
function makeCookieOptions(remember) {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  if (remember) {
    // 30 days
    opts.maxAge = 1000 * 60 * 60 * 24 * 30;
  }

  return opts;
}

/**
 * SIGNUP
 */
export async function signupUser(req, res) {
  const { email, password, role = "user", remember = false } = req.body;

  try {
    const normalizedEmail =
      email == null ? "" : String(email).trim().toLowerCase();

    // 1️⃣ Check if email already exists
    const existing = await prisma.users.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
      select: { id: true },
    });

    if (existing) {
      return res.status(409).json({ detail: "Email already registered" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await prisma.users.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // 4️⃣ Ensure JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ detail: "Server misconfigured" });
    }

    // 5️⃣ Sign token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Set cookie
    res.cookie("authToken", token, makeCookieOptions(remember));

    return res.status(201).json({
      email: user.email,
      message: "Signup successful",
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return res.status(409).json({ detail: "Email already registered" });
    }

    return res.status(500).json({ detail: "Internal server error" });
  }
}

/**
 * LOGIN
 */
export async function loginUser(req, res) {
  const { email, password, remember = false } = req.body;

  try {
    const normalizedEmail =
      email == null ? "" : String(email).trim().toLowerCase();
    const inPassword = password == null ? "" : String(password);

    // 1️⃣ Find user (case-insensitive)
    const user = await prisma.users.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(500).json({ detail: "User record missing password" });
    }

    // 2️⃣ Compare password
    const success = await bcrypt.compare(inPassword, user.password);
    console.log(success)
    if (!success) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    // 3️⃣ Ensure JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ detail: "Server misconfigured" });
    }

    // 4️⃣ Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    // 5️⃣ Set cookie
    res.cookie("authToken", token, makeCookieOptions(remember));

    return res.status(200).json({
      email: user.email,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ detail: "Server error" });
  }
}

/**
 * LOGOUT
 */
export function logoutUser(req, res) {
  res.clearCookie("authToken", { path: "/" });
  return res.status(200).json({ message: "Logged out" });
}

/**
 * VERIFY TOKEN MIDDLEWARE
 */
export function verifyToken(req, res, next) {
  try {
    const token = req.cookies?.authToken;
    if (!token) {
      return res.status(401).json({ detail: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}
