// Client component to conditionally render navbar
// "use client";
export function NavbarWrapper({ children }: { children: React.ReactNode }) {
	const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

	// Hide navbar on home page
	if (pathname === '/') {
		return null;
	}

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
			{children}
		</header>
	);
}