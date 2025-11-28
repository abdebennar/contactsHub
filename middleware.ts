import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
	"/",
	"/sign-in(.*)",
	"/sign-up(.*)",
	"/sso-callback(.*)",
	"/api/webhooks(.*)",
	"/api/new_user(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
	const { userId, redirectToSignIn } = await auth();
	const path = req.nextUrl.pathname;

	if (path === "/") {
		return;
	}

	if (!isPublicRoute(req) && !userId) {
		return redirectToSignIn({ returnBackUrl: "/sign-in" });
	}

	return;
});


export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};