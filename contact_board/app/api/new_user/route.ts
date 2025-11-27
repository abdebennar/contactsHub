// Example with Next.js API route
import { Webhook } from 'svix'
import { headers } from 'next/headers'


// TODO move to types 

interface UserCreatedData {
	id: string;
	email_addresses: { email_address: string }[];
	first_name: string;
	last_name: string;
	image_url?: string;
}

interface WebhookEvent {
	type: 'user.created' | string;
	data: UserCreatedData;
}

export async function POST(req: Request) {
	const WEBHOOK_SECRET: string | undefined = process.env.CLERK_WEBHOOK_SECRET

	// Get headers
	const headerPayload = headers()
	const svix_id = (await headerPayload).get("svix-id")
	const svix_timestamp = (await headerPayload).get("svix-timestamp")
	const svix_signature = (await headerPayload).get("svix-signature")

	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Missing Svix headers', { status: 400 })
	}


	// add all above in a promise.all to optimize

	// Get body
	const payload = await req.json()
	const body = JSON.stringify(payload)


	if (!WEBHOOK_SECRET) {
		return new Response('Webhook secret not configured', { status: 500 })
	}

	// Verify webhook
	const wh = new Webhook(WEBHOOK_SECRET)
	const evt = wh.verify(body, {
		"svix-id": svix_id,
		"svix-timestamp": svix_timestamp,
		"svix-signature": svix_signature,
	}) as WebhookEvent;

	// Handle the webhook
	const { type, data } = evt

	// if (type === 'user.created') {
	// 	await createUserInDatabase({
	// 		clerkId: data.id,
	// 		email: data.email_addresses[0].email_address,
	// 		firstName: data.first_name,
	// 		lastName: data.last_name,
	// 		imageUrl: data.image_url,
	// 	})
	// }

	return new Response('', { status: 200 })
}