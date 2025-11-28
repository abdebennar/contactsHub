"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

const Index = () => {
	const router = useRouter();
	const { isSignedIn, isLoaded } = useUser();

	// Show loading state while checking auth
	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
			<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary mb-6">
				<Building2 className="h-8 w-8 text-primary-foreground" />
			</div>

			<h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
				Agency Contact Dashboard
			</h1>

			<p className="text-lg text-muted-foreground text-center max-w-md mb-8">
				Access and manage your agency contacts. View up to 50 contact details per day.
			</p>

			<div className="flex gap-4">
				{isSignedIn ? (
					<Button size="lg" onClick={() => router.push("/agencies")}>
						Start
					</Button>
				) : (
					<>
						<Button size="lg" onClick={() => router.push("/sign-in")}>
							Sign In
						</Button>
						<Button size="lg" variant="outline" onClick={() => router.push("/sign-up")}>
							Sign Up
						</Button>
					</>
				)}
			</div>
		</div>
	);
};

export default Index;