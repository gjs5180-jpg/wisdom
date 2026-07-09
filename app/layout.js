import "./globals.css";
import Link from "next/link";
import { Nanum_Myeongjo, Noto_Sans_KR } from "next/font/google";
import { SITE } from "@/lib/content";
import AppBottomNav from "@/components/AppBottomNav";
import HeaderNav from "@/components/HeaderNav";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

export const metadata = {
  title: "마인드루트 — 문제를 행동 루틴으로 바꾸는 성장 루트",
  description:
    "실제 고민을 패턴 이해, 관점 비교, 작은 행동 루틴으로 정리합니다. 카드마다 출처와 맥락을 함께 보여줍니다.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${nanumMyeongjo.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
          <div className="mx-auto w-full max-w-2xl px-5 h-16 flex items-center justify-between">
            <Link href="/" className="min-w-0 font-serif text-xl font-bold tracking-tight">
              <span className="block leading-none">{SITE.name}</span>
              <span className="mt-1 hidden text-[10px] font-normal tracking-normal text-ink-faint sm:block">
                MindRoute
              </span>
            </Link>
            <HeaderNav />
          </div>
        </header>

        <main className="flex-1 mx-auto w-full max-w-2xl px-5 pb-24 pt-7 sm:pb-8 sm:pt-8">
          {children}
        </main>

        <footer className="mb-20 mt-10 border-t border-line sm:mb-0">
          <div className="mx-auto w-full max-w-2xl px-5 py-6 text-xs text-ink-faint leading-relaxed">
            {SITE.name} · 실제 고민을 가능한 패턴, 신뢰할 만한 관점, 작은 행동
            루틴으로 바꾸는 것을 목표로 합니다.
          </div>
        </footer>
        <AppBottomNav />
      </body>
    </html>
  );
}
