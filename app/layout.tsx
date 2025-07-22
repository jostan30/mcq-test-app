
import "./globals.css";
import SessionWrapper from "./providers/SessionProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
      <SessionWrapper>{children}</SessionWrapper>

      </body>
    </html>
  );
}
