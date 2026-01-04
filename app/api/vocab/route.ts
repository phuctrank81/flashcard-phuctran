import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Words from "@/models/words";

export async function GET() {
  try {
    await connectDB();

    const words = await Words.find({ timeout: 3000 }).lean();

    // Thêm độ trễ 30 giây
    await new Promise(resolve => setTimeout(resolve, 30000));

    return NextResponse.json(words);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Không lấy được dữ liệu" },
      { status: 500 }
    );
  }
}