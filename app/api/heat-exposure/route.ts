import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 여기서 실제 저장 API로 전달하면 됨
    // 예: Power Automate, SharePoint API, 사내 API 등
    console.log("폭염노출 외부작업 전수조사 제출 데이터:", body);

    return NextResponse.json({
      ok: true,
      message: "submitted",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "invalid request",
      },
      { status: 400 }
    );
  }
}
