import clientPromise from "@/lib/mongo"; // ← your connection file
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const client = await clientPromise;
		const db = client.db(); // default DB from your URI		

		
		const contacts = await db
		.collection("agencies_agency_rows")
		.find({})
		.limit(10)
		.toArray();
		
		console.log(contacts);

		return NextResponse.json({ success: true, data: contacts });
	} catch (error: any) {
		console.error("GET /api/contacts error:", error);
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
