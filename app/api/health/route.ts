import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

// Ensure this runs in Node.js runtime (not Edge) because we use Mongoose
export const runtime = "nodejs";

export async function GET() {
  const startedAt = new Date().toISOString();
  try {
    const conn = await connectToDatabase();
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const readyState = mongoose.connection.readyState;

    return NextResponse.json(
      {
        ok: true,
        startedAt,
        env: process.env.NODE_ENV,
        driver: "mongoose",
        mongoUriPresent: Boolean(process.env.MONGO_URI),
        connection: {
          readyState,
          host: (conn as typeof mongoose).connection.host,
          name: (conn as typeof mongoose).connection.name,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        startedAt,
        env: process.env.NODE_ENV,
        error: message,
        mongoUriPresent: Boolean(process.env.MONGO_URI),
      },
      { status: 500 }
    );
  }
}
