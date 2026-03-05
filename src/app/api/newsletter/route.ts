import { NextRequest, NextResponse } from "next/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email" },
        { status: 400 },
      );
    }

    const webhookUrl = process.env.DISCORD_NEWSLETTER_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { message: "Newsletter webhook not configured" },
        { status: 503 },
      );
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `📩 Newsletter signup: ${email.trim().toLowerCase()}`,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to push email to webhook" },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: "ok" });
  } catch {
    return NextResponse.json(
      { message: "Unexpected error" },
      { status: 500 },
    );
  }
}
