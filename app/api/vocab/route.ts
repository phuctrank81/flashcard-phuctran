import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import words from "@/models/words";

export async function GET() {
  try {
    await connectDB();

    const data = await words.find(); // 🔥 fetch từ words.ielts_vocabulary

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Database connection or query failed" },
      { status: 500 }
    );
  }
}
