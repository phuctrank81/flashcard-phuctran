import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Words from "@/models/words";


export async function GET() {
  try {
    await connectDB();

    const words = await Words
      .find({})
      .maxTimeMS(30000)
      .lean();

    return NextResponse.json(words);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Không lấy được dữ liệu" },
      { status: 500 }
    );
  }
}