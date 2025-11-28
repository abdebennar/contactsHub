"use client";

import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { NavLinks } from "@/components/NavLink";
import Link from "next/link";
import { Home } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
	const pathname = usePathname();

	if (pathname === "/" || pathname === "/sign-in" || pathname === "/sign-up") return null;

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
			<div className="flex justify-between items-center px-6 h-16">
				<Link href="/" className="font-semibold text-lg hover:opacity-80 transition-opacity">
					<Home />
				</Link>

				<div className="flex items-center gap-20 ml-auto">
					<SignedIn>
						<div className="flex items-center gap-7">
							<NavLinks />
						</div>
					</SignedIn>

					<div className="flex items-center">
						<SignedOut>
							<SignInButton />
							<SignUpButton>
								<button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm h-10 px-5 cursor-pointer hover:bg-[#5639cc] transition">
									Sign Up
								</button>
							</SignUpButton>
						</SignedOut>
						<SignedIn>
							<UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
						</SignedIn>
					</div>
				</div>
			</div>
		</header>
	);
}
