import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
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

export async function POST(req: NextRequest) {
	try {
		const evt = await verifyWebhook(req) as WebhookEvent;

		const { type, data } = evt;

		if (type === "user.created") {

			const client = await clientPromise;
			const db = client.db();

			const userDoc = {
				userId: data.id,
				dailyViews: {},
				createdAt: new Date(),
				updatedAt: new Date()
			};

			await db.collection("users").updateOne(
				{ userId: data.id },
				{ $setOnInsert: userDoc },
				{ upsert: true }
			);

			console.log("User inserted/verified in DB");
		}

		return new Response('Webhook received', { status: 200 });
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return new Response('Error verifying webhook', { status: 400 });
	}
}