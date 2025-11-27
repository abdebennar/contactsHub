"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
	const pathname = usePathname();

	const linkStyle = (path: string) =>
		pathname.startsWith(path)
			? "font-semibold text-sm transition-colors text-[#5184EE]"
			: "text-muted-foreground text-sm hover:text-[#5184EE]"



	return (
		<div className="flex items-center gap-7">
			<Link href="/contacts" className={linkStyle("/contacts")}>
				Contacts
			</Link>

			<Link href="/agencies" className={linkStyle("/agencies")}>
				Agencies
			</Link>
		</div>
	);
}
