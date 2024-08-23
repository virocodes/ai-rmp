import { Inter } from "next/font/google";
import { SignedIn, SignedOut, UserButton, ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className="font-sans bg-gray-50">
          <header className="bg-transparent shadow-lg">
            <nav className="flex items-center justify-between px-6 py-4">
              <Link href="/" passHref>
                <p className="text-2xl font-bold text-gray-900">AI Flashcards</p>
              </Link>
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <Link href="/login" passHref>
                    <p className="text-gray-900 hover:underline">Login</p>
                  </Link>
                  <Link href="/signup" passHref>
                    <p className="text-gray-900 hover:underline">Sign Up</p>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>
          </header>

          {/* Content */}
          <main className="min-h-screen">{children}</main>
        </body>
      </ClerkProvider>
    </html>
  );
}
