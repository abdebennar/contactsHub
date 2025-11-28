// import { type Metadata } from "next";
// import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { NavLinks } from "@/components/NavLink";
// import Link from "next/link";
// import { Home } from "lucide-react";
// import { NavbarWrapper } from "@/components/NavbarWrapper";

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

// export const metadata: Metadata = {
// 	title: "Agency Contact Dashboard",
// 	description: "Manage your agency contacts",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
// 	return (
// 		<ClerkProvider>
// 			<html lang="en">
// 				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
// 					{/* Fixed Top Bar */}
// 					<NavbarWrapper>
// 						<div className="flex justify-between items-center px-6 h-16">
// 							{/* Logo/Brand on the left */}
// 							<Link href={"/"} className="font-semibold text-lg hover:opacity-80 transition-opacity">
// 								<Home />
// 							</Link>

// 							{/* Spacer to push links + auth to the right */}
// 							<div className="flex items-center gap-20 ml-auto">
// 								{/* Navigation Links - only show when signed in */}
// 								<SignedIn>
// 									<div className="flex items-center gap-7">
// 										<NavLinks />
// 									</div>
// 								</SignedIn>

// 								{/* Auth Buttons / User Avatar */}
// 								<div className="flex items-center">
// 									<SignedOut>
// 										{/* Hide auth buttons on home page - they're in the hero */}
// 									</SignedOut>
// 									<SignedIn>
// 										<UserButton
// 											appearance={{
// 												elements: {
// 													avatarBox: "w-10 h-10"
// 												}
// 											}}
// 										/>
// 									</SignedIn>
// 								</div>
// 							</div>
// 						</div>
// 					</NavbarWrapper>

// 					{/* Main Content with top padding to account for fixed header */}
// 					<main className="pt-16 min-h-screen">
// 						{children}
// 					</main>
// 				</body>
// 			</html>
// 		</ClerkProvider>
// 	);
// }



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
					{/* Navbar hidden on home, shown on all other pages */}
					<Navbar />

					<main className="min-h-screen pt-16">
						{children}
					</main>
				</body>
			</html>
		</ClerkProvider>
	);
}
