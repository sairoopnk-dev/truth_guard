import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

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
        <div className="flex flex-1 w-full overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 w-full overflow-y-auto">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
