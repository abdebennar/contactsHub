"use server";

import clientPromise from "@/lib/mongo";
import { Contact } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function fetchContactDetails(contactId: string): Promise<Contact | null> {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("Unauthorized");
	}

	const client = await clientPromise;
	const db = client.db();

	const today = new Date().toISOString().slice(0, 10);
	const user = await db.collection("users").findOne({ userId });

	if (!user) {
		throw new Error("User not found: sign-up to view contact details");
	}

	const todayViews = user.dailyViews?.[today] ?? 0;

	if (todayViews >= 50) {
		throw new Error("Daily limit exceeded");
	}

	const contact = await db
		.collection("contacts_contact_rows")
		.findOne(
			{ id: contactId },
			{ projection: { _id: 0 } }
		) as Contact | null;

	if (!contact) {
		return null;
	}

	await db.collection("users").updateOne(
		{ userId },
		{
			$inc: { [`dailyViews.${today}`]: 1 },
			$set: { updatedAt: new Date() }
		}
	);

	return contact;
}
