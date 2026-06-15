import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "폭염노출 외부작업 전수조사",
  description: "켐트로닉스/제이쓰리 폭염노출 외부작업 전수조사",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
