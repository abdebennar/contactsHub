import { Webhook } from "svix";
import { headers } from "next/headers";
import clientPromise from "@/lib/mongo";

interface UserCreatedData {
	id: string;
	email_addresses: { email_address: string }[];
	first_name: string;
	last_name: string;
	image_url?: string;
}

interface WebhookEvent {
	type: "user.created" | string;
	data: UserCreatedData;
}

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		return new Response("Webhook secret not configured", { status: 500 });
	}


	const headerPayload = headers();
	const svix_id = (await headerPayload).get("svix-id");
	const svix_timestamp = (await headerPayload).get("svix-timestamp");
	const svix_signature = (await headerPayload).get("svix-signature");

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Missing Svix headers", { status: 400 });
	}


	const payload = await req.json();
	const body = JSON.stringify(payload);


	const wh = new Webhook(WEBHOOK_SECRET);
	const evt = wh.verify(body, {
		"svix-id": svix_id,
		"svix-timestamp": svix_timestamp,
		"svix-signature": svix_signature,
	}) as WebhookEvent;

	const { type, data } = evt;

	console.log("Webhook event:", type);


	if (type === "user.created") {

		// debug 
		console.log("[info] New user data: ||||||||||||||||||||||", data);

		// const client = await clientPromise;
		// const db = client.db();

		// const userDoc = {
		// 	clerkId: data.id,
		// 	email: data.email_addresses[0]?.email_address ?? null,
		// 	firstName: data.first_name ?? "",
		// 	lastName: data.last_name ?? "",
		// 	imageUrl: data.image_url ?? null,
		// 	createdAt: new Date(),
		// };


		// await db.collection("users").updateOne(
		// 	{ clerkId: data.id },
		// 	{ $setOnInsert: userDoc },
		// 	{ upsert: true }
		// );

		console.log("User inserted/verified in DB");
	}

	return new Response("", { status: 200 });
}
