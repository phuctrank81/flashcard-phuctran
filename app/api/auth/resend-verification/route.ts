import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const { sendVerificationEmail } = require("../../../../lib/emailService");

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
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Thiếu email" }, { status: 400 });
    }

    const normalized = String(email).trim().toLowerCase();

    const result = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": normalized },
      })
    );

    const user = result.Items && result.Items.length > 0 ? result.Items[0] : null;
    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy tài khoản" }, { status: 404 });
    }

    if (user.isVerified === true) {
      return NextResponse.json({ message: "Tài khoản đã được xác thực" }, { status: 400 });
    }

    const verificationToken = randomUUID();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await ddb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { user_id: user.user_id },
        UpdateExpression: "SET verificationToken = :token, verificationTokenExpiry = :exp",
        ExpressionAttributeValues: {
          ":token": verificationToken,
          ":exp": verificationTokenExpiry,
        },
      })
    );

    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || req.nextUrl.origin || "http://localhost:3000";
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    const emailResult = await sendVerificationEmail(normalized, verificationToken, user.username || "", verificationUrl);
    console.log("[resend-verification]", { email: normalized, emailResult });

    return NextResponse.json({
      message: emailResult?.success ? "Đã gửi lại email xác nhận" : `Không gửi được email: ${emailResult?.error || ""}`,
      emailError: emailResult?.success ? null : emailResult?.error || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi server";
    console.error("[resend-verification]", message, err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}

export const runtime = "nodejs";
