import connectDB from "@/server/lib/mongodb";
import Words from "@/server/models/words";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const words = await Words.find().lean();
    return NextResponse.json(words);
  } catch (error) {
    return NextResponse.json(
      { error: "Không lấy được dữ liệu" },
      { status: 500 }
    );
  }
}
