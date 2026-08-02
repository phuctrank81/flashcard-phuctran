const { NextResponse } = require("next/server");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

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
    const { token } = await request.json();

    if (!token) {
      return errorResponse("Token xác thực không hợp lệ", 400);
    }

    const now = new Date().toISOString();
    const result = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "verificationToken = :token",
        ExpressionAttributeValues: {
          ":token": token,
        },
      })
    );

    const user = result.Items && result.Items.length > 0
      ? result.Items.find((item) => item.verificationToken === token)
      : null;

    if (!user) {
      return errorResponse("Token xác thực không hợp lệ hoặc đã hết hạn", 400);
    }

    if (!user.verificationTokenExpiry || new Date(user.verificationTokenExpiry) <= new Date(now)) {
      return errorResponse("Token xác thực đã hết hạn", 400);
    }

    await ddb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { user_id: user.user_id },
        UpdateExpression: "SET isVerified = :isVerified, verificationToken = :verificationToken, verificationTokenExpiry = :verificationTokenExpiry",
        ExpressionAttributeValues: {
          ":isVerified": true,
          ":verificationToken": null,
          ":verificationTokenExpiry": null,
        },
      })
    );

    return jsonResponse({
      message: "Email đã được xác thực thành công!",
      user: {
        id: user.user_id || user.id,
        username: user.username,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi server khi xác thực email";
    console.error("[auth.verify]", message);
    return errorResponse("Lỗi server khi xác thực email", 500, message);
  }
};
