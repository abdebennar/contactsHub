"use server";

import clientPromise from "@/lib/mongo";
import { Contact } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function fetchContactDetails(contactId: string): Promise<Contact | null> {
	const { userId } = await auth();
	// const userId = "clerk_user_id_example"; // TODO: replace with actual user ID from auth

	console.log("Fetching contact details for user ||||||||||||||||||||||||||| :", userId);

	if (!userId) {
		throw new Error("Unauthorized");
	}

	const client = await clientPromise;
	const db = client.db();

	const today = new Date().toISOString().slice(0, 10);

	// get user's viewed count
	const userView = await db
		.collection("user_views")
		.findOne({ userId, date: today });

	const viewedCount = userView?.viewedCount ?? 0;

	if (viewedCount >= 50) {
		throw new Error("Daily limit exceeded");
	}

	// get the contact
	const contact = await db.collection("contacts_contact_rows")
		.findOne({ id: contactId }, { projection: { _id: 0 } }) as unknown as Contact | null;

	if (!contact) return null;

	// increase their count
	await db.collection("user_views").updateOne(
		{ userId, date: today },
		{ $inc: { viewedCount: 1 } },
		{ upsert: true }
	);

	return { ...contact };
}
