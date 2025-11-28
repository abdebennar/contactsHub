"use server";

import clientPromise from "@/lib/mongo";
import { Contact } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function fetchContactDetails(contactId: string): Promise<Contact | null> {
	try {
		const { userId } = await auth();

		if (!userId) {
			throw new Error("Please sign in to view contact details");
		}

		const client = await clientPromise;
		const db = client.db();

		const today = new Date().toISOString().slice(0, 10);
		const user = await db.collection("users").findOne({ userId });

		// Auto-create user if doesn't exist
		if (!user) {
			await db.collection("users").insertOne({
				userId,
				dailyViews: { [today]: 0 },
				createdAt: new Date(),
				updatedAt: new Date()
			});
		} else {
			const todayViews = user.dailyViews?.[today] ?? 0;

			if (todayViews >= 50) {
				throw new Error("Daily limit exceeded");
			}
		}

		const contact = await db
			.collection("contacts_contact_rows")
			.findOne(
				{ id: contactId },
				{ projection: { _id: 0 } }
			) as Contact | null;

		if (!contact) {
			throw new Error("Contact not found");
		}

		await db.collection("users").updateOne(
			{ userId },
			{
				$inc: { [`dailyViews.${today}`]: 1 },
				$set: { updatedAt: new Date() }
			},
			{ upsert: true }
		);

		return contact;

	} catch (error) {
		console.error('fetchContactDetails error:', error);

		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Unable to load contact. Please try again.");
	}
}