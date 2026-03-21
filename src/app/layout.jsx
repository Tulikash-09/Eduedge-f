import "./globals.css";

export const metadata = {
  title: "EduEdge — AI Learning Platform",
  description: "AI-powered Socratic tutor for CBSE Class 10",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
