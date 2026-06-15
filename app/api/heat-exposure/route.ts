import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (siteUrl && origin && origin !== siteUrl) {
      return NextResponse.json(
        { ok: false, message: "허용되지 않은 요청입니다." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const powerAutomateUrl = process.env.POWER_AUTOMATE_URL;
    const surveySecret = process.env.SURVEY_SECRET;

    if (!powerAutomateUrl || !surveySecret) {
      return NextResponse.json(
        { ok: false, message: "서버 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const flowRes = await fetch(powerAutomateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-survey-secret": surveySecret,
      },
      body: JSON.stringify(body),
    });

    if (!flowRes.ok) {
      return NextResponse.json(
        { ok: false, message: "Power Automate 전송 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "submitted",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "invalid request" },
      { status: 400 }
    );
  }
}
