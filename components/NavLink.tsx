
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
	const pathname = usePathname();

	const linkStyle = (path: string) =>
		pathname.startsWith(path)
			? "font-semibold text-base text-[#5184EE] border-b-2 border-[#5184EE] pb-1"
			: "text-gray-700 text-base hover:text-[#5184EE] hover:border-b-2  border-b-2 border-transparent pb-1 transition-all cursor-pointer"

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