import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const powerAutomateUrl = process.env.POWER_AUTOMATE_URL;
    const surveySecret = process.env.SURVEY_SECRET;

    if (!powerAutomateUrl || !surveySecret) {
      return NextResponse.json(
        {
          ok: false,
          message: "환경변수가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    const payload = {
      key: surveySecret,
      ...body,
    };

    const flowRes = await fetch(powerAutomateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!flowRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Power Automate 전송 실패",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "제출 완료",
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "잘못된 요청입니다.",
      },
      { status: 400 }
    );
  }
}
