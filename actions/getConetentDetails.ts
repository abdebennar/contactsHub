"use server";

import clientPromise from "@/lib/mongo";
import { Contact } from "@/types";
import { auth } from "@clerk/nextjs/server";

type FetchContactResult =
	| { success: true; contact: Contact }
	| { success: false; message: string };

export async function fetchContactDetails(contactId: string): Promise<FetchContactResult> {
	try {
		const { userId } = await auth();

		if (!userId) {
			return { success: false, message: "Please sign in to view contact details" };
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
				return { success: false, message: "Daily limit exceeded" };
			}
		}

		const contact = await db
			.collection("contacts_contact_rows")
			.findOne(
				{ id: contactId },
				{ projection: { _id: 0 } }
			) as Contact | null;

		if (!contact) {
			return { success: false, message: "Contact not found" };
		}

		await db.collection("users").updateOne(
			{ userId },
			{
				$inc: { [`dailyViews.${today}`]: 1 },
				$set: { updatedAt: new Date() }
			},
			{ upsert: true }
		);

		return { success: true, contact };

	} catch (error) {
		console.error('fetchContactDetails error:', error);
		return { success: false, message: "Unable to load contact. Please try again." };
	}
}