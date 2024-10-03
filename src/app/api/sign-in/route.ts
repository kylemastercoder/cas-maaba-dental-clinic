import db from "@/lib/db";
import bcrypt from "bcryptjs";
import * as jose from "jose";

export async function POST(request: Request) {
  try {
    // Read data off req body
    const body = await request.json();
    const { username, password } = body;

    // Validate data
    if (!username || !password) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Lookup the user
    const user = await db.user.findFirst({
      where: { username },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    // Compare password
    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    if (!isCorrectPassword) {
      return Response.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id.toString())
      .sign(secret);

    // Respond with token
    return Response.json({ token: jwt });
  } catch (error) {
    console.error("Login error:", error); // Log error details
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
