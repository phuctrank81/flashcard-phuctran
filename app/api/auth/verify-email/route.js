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

const jsonResponse = (data, init = {}) => NextResponse.json(data, init);
const errorResponse = (message, status = 500, error) =>
  jsonResponse({ message, ...(error ? { error } : {}) }, { status });

// Scan toàn bộ các trang để tránh miss user khi bảng vượt quá 1MB/1 lần scan
async function findUserByToken(token) {
  let lastKey;
  do {
    const result = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "verificationToken = :token",
        ExpressionAttributeValues: { ":token": token },
        ExclusiveStartKey: lastKey,
      })
    );
    const found = result.Items && result.Items.find((item) => item.verificationToken === token);
    if (found) return found;
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return null;
}

async function verifyToken(token) {
  if (!token) {
    return { status: 400, body: { message: "Token xác thực không hợp lệ" } };
  }

  const user = await findUserByToken(token);

  if (!user) {
    return { status: 400, body: { message: "Token xác thực không hợp lệ hoặc đã hết hạn" } };
  }

  if (user.isVerified === true) {
    return {
      status: 200,
      body: {
        message: "Email đã được xác thực trước đó",
        user: { id: user.user_id || user.id, username: user.username, email: user.email, isVerified: true },
      },
    };
  }

  if (!user.verificationTokenExpiry || new Date(user.verificationTokenExpiry).getTime() <= Date.now()) {
    return { status: 400, body: { message: "Token xác thực đã hết hạn" } };
  }

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { user_id: user.user_id },
      UpdateExpression: "SET isVerified = :isVerified REMOVE verificationToken, verificationTokenExpiry",
      ExpressionAttributeValues: { ":isVerified": true },
    })
  );

  return {
    status: 200,
    body: {
      message: "Email đã được xác thực thành công!",
      user: { id: user.user_id || user.id, username: user.username, email: user.email, isVerified: true },
    },
  };
}

// POST: dùng khi frontend có page riêng đọc query param rồi tự fetch API
exports.POST = async (request) => {
  try {
    const { token } = await request.json();
    const result = await verifyToken(token);
    return jsonResponse(result.body, { status: result.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi server khi xác thực email";
    console.error("[auth.verify][POST]", message);
    return errorResponse("Lỗi server khi xác thực email", 500, message);
  }
};

function renderResultHtml({ success, message, loginUrl }) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${success ? "Xác thực thành công" : "Xác thực thất bại"}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); text-align: center; max-width: 420px; }
  .icon { font-size: 48px; margin-bottom: 16px; }
  h1 { font-size: 20px; margin: 0 0 8px; color: ${success ? "#16a34a" : "#dc2626"}; }
  p { color: #555; margin: 0 0 24px; }
  a.btn { display: inline-block; padding: 10px 24px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; }
</style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? "✅" : "❌"}</div>
    <h1>${success ? "Xác thực thành công!" : "Xác thực thất bại"}</h1>
    <p>${message}</p>
    <a class="btn" href="${loginUrl}">Đi tới trang đăng nhập</a>
  </div>
</body>
</html>`;
}

// GET: email link trỏ thẳng vào route này (bấm link -> browser GET).
// Không có page.tsx riêng nên trả thẳng một trang HTML kết quả.
exports.GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const result = await verifyToken(token);

    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || new URL(request.url).origin;
    const loginUrl = new URL("/login", frontendUrl).toString();

    const html = renderResultHtml({
      success: result.status === 200,
      message: result.body.message,
      loginUrl,
    });

    return new NextResponse(html, {
      status: result.status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi server khi xác thực email";
    console.error("[auth.verify][GET]", message);
    const html = renderResultHtml({
      success: false,
      message: "Lỗi server khi xác thực email",
      loginUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "/",
    });
    return new NextResponse(html, { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
};