import { NextResponse } from "next/server";

export async function GET() {
  // @ts-expect-error Module in server folder
  const connectDB = (await import("../../server/lib/mongodb.js")).default;
  // @ts-expect-error Module in server folder
  const Words = (await import("../../server/models/words")).default;

  try {
    await connectDB();

    const words = await Words.find().lean();

    return NextResponse.json(words);
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
    return NextResponse.json(
      { error: "Không lấy được dữ liệu" },
      { status: 500 }
    );
  }
}