import { PracticeProvider } from "@/features/practice/practice-provider";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Within — A quiet space for jap",
  description:
    "A little space for yourself. Practise Naam Jap and Mantra Jap with counting, gentle breathing, or a timer. Available in Hindi and English.",
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <PracticeProvider>{children}</PracticeProvider>
      </body>
    </html>
  );
}
