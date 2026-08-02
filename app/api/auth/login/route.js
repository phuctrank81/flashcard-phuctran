const { NextResponse } = require("next/server");
const bcrypt = require("bcryptjs");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

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

const jsonResponse = (data, init = {}) =>
  NextResponse.json(data, init);

const errorResponse = (message, status = 500, error) =>
  jsonResponse(
    { message, ...(error ? { error } : {}) },
    { status }
  );

exports.POST = async (request) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse("Thiếu email hoặc mật khẩu", 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const result = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": normalizedEmail,
        },
      })
    );

    const user = result.Items && result.Items.length > 0
      ? result.Items.find((item) => String(item.email || "").toLowerCase() === normalizedEmail)
      : null;

    if (!user) {
      return errorResponse("Sai email hoặc mật khẩu", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return errorResponse("Sai email hoặc mật khẩu", 401);
    }

    return jsonResponse({
      message: "Đăng nhập thành công",
      user: {
        id: user.user_id || user.id || user._id,
        username: user.username,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi server";
    console.error("[auth.login]", message);
    return errorResponse("Lỗi server", 500, message);
  }
};
