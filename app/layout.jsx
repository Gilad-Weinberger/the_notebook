import { Rubik } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const rubik = Rubik({
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const metadata = {
  title: "המחברת - פלטפורמת לימודים",
  description: "אפליקציית המחברת לניהול חומרי לימוד והערות",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
