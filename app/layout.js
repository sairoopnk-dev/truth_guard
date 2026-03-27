import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "TruthGuard AI | Detect Misinformation & Stay Safe Online",
  description:
    "TruthGuard AI uses cutting-edge AI to help you detect fake news, check website safety, and identify AI-generated content.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
