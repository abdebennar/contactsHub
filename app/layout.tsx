
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider signInUrl="/sign-in" afterSignOutUrl={"/"} signInFallbackRedirectUrl={"/agencies"}>
			<html lang="en">
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>


					<Navbar />
					<main className="min-h-screen pt-16">
						{children}
					</main>
				</body>
			</html>
		</ClerkProvider>
	);
}
