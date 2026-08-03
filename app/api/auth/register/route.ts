import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          ...(process.env.AWS_SESSION_TOKEN
            ? { sessionToken: process.env.AWS_SESSION_TOKEN }
            : {}),
        }
      : undefined,
});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_USER_TABLE || "Users";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Thiếu thông tin đăng ký" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": normalizedEmail },
      })
    );

    if (existing.Items && existing.Items.length > 0) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      user_id: randomUUID(),
      username: String(username).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: true,
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: user,
        ConditionExpression: "attribute_not_exists(user_id)",
      })
    );

    const userWithoutPassword = { ...user };
    const safeUser = Object.fromEntries(
      Object.entries(userWithoutPassword).filter(([key]) => key !== "password")
    );

    return NextResponse.json(
      {
        message: "Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.",
        user: safeUser,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Có lỗi xảy ra khi đăng ký";
    const stack = err instanceof Error ? err.stack : "";
    console.error("[Register Error] Message:", message);
    console.error("[Register Error] Stack:", stack);
    console.error("[Register Error] Full error:", err);

    let userMessage = "Có lỗi xảy ra khi đăng ký";
    if (
      message.includes("Unable to connect") ||
      message.includes("ECONNREFUSED") ||
      message.includes("Credentials") ||
      message.includes("Missing") ||
      message.includes("UnrecognizedClientException") ||
      message.includes("ResourceNotFoundException")
    ) {
      userMessage = "Không thể kết nối DynamoDB. Vui lòng kiểm tra cấu hình AWS.";
    }

    return NextResponse.json(
      { message: userMessage },
      { status: 500 }
    );
  }
}