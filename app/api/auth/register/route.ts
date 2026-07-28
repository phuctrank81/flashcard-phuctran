import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
});
const ddb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Users";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Validate lại ở backend
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

    // Kiểm tra email đã tồn tại chưa (dùng GSI email-index)
    const existing = await ddb.send(
      new QueryCommand({
        TableName: "Users",
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email },
      })
    );

    if (existing.Items && existing.Items.length > 0) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng" },
        { status: 409 }
      );
    }

    // Hash password trước khi lưu — không bao giờ lưu plain text
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      user_id: randomUUID(),
      username,
      email,  
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await ddb.send(
      new PutCommand({
        TableName: "Users",
        Item: user,
        ConditionExpression: "attribute_not_exists(user_id)",
      })
    );

    // Không trả password về client
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "Đăng ký thành công", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi đăng ký" },
      { status: 500 }
    );
  }
}